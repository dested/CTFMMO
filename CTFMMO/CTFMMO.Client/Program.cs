using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Html;
using System.Html.Media.Graphics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using CTFMMO.Common;
using RTree;

namespace CTFMMO.Client
{

    public class Program
    {
        private static int ids = 0;
        private static int nextId()
        {
            return ids++;
        }
        public static Random rand = new Random();
        public static Vector2 Offset;
        public static int viewRadius = 60;
        public static int MaxClusterSize = 500;
        public static int numberOfPlayers = 50000;
        public static int gameSize = 2500;
        public static int squareSize = 4;
        public static bool drawLines = false;
        private static RTree<Player> tree;
        private static List<Player> players;

        private static List<PlayerCluster> clusters;
        private static CanvasRenderingContext2D context;
        private static CanvasElement canvas;

        static void Main()
        {
            start();
        }

        private static void start()
        {
            canvas = (CanvasElement)Document.GetElementById("canvas");
            context = (CanvasRenderingContext2D)canvas.GetContext(CanvasContextId.Render2D);

            Offset = new Vector2(0, 0);

            Vector2 draggingPos = null;
            canvas.OnMousedown = @event =>
            {
                int mouseX = ((dynamic)@event).pageX;
                int mouseY = ((dynamic)@event).pageY;
                draggingPos = new Vector2(mouseX, mouseY);
            };
            canvas.OnMouseup = @event =>
            {
                /*
                                if (draggingPos == null) return;

                                int mouseX = ((dynamic)@event).pageX;
                                int mouseY = ((dynamic)@event).pageY;

                                draggingPos = new Vector2(draggingPos.X - mouseX, draggingPos.Y - mouseY);

                                Offset = new Vector2(Offset.X + draggingPos.X, Offset.Y + draggingPos.Y);
                                draw();


                */
                draggingPos = null;
            };
            Document.OnMousemove = @event =>
            {
                if (draggingPos == null) return;

                int mouseX = ((dynamic)@event).pageX;
                int mouseY = ((dynamic)@event).pageY;

                Offset = new Vector2(Offset.X + (draggingPos.X - mouseX) * 6, Offset.Y + (draggingPos.Y - mouseY) * 6);

                draggingPos = new Vector2(mouseX, mouseY);
                Draw();
            };



            canvas.Width = Document.Body.ClientWidth - 100;
            canvas.Height = Document.Body.ClientHeight - 100;
            context.Save();
            context.Font = "50px Arial";
            context.FillText("Loading...", canvas.Width / 2, canvas.Height / 2);
            context.Restore();


            Window.OnKeydown = @event =>
            {
                if (((dynamic)@event).keyCode == 17)
                {
                    drawLines = !drawLines;
                }
                Draw();
            };


        
             


            Window.SetTimeout(() =>
            {
                Console.WriteLine("Started");
                Console.Profile();

                Stopwatch sw = new Stopwatch();
                sw.Start();
                tree = new RTree<Player>();
                players = new List<Player>();
                for (int j = 0; j < numberOfPlayers; j++)
                {
                    var player = new Player(nextId());
                    player.X = rand.Next(0, gameSize);
                    player.Y = rand.Next(0, gameSize);
                    players.Add(player);
                    tree.Add(new Rectangle(player.X, player.Y), player);
                }

                buildClusters(viewRadius);

                sw.Stop();
                Console.ProfileEnd();
                Console.WriteLine(string.Format("Time {0}", sw.ElapsedMilliseconds));
                Console.WriteLine("Done");
                Draw();
            });
        }


        public static void Draw()
        {
            canvas.Width = canvas.Width;
            context.Save();
            context.Translate(-Offset.X, -Offset.Y);

            context.Save();
            context.StrokeStyle = "black";
            var bigBox = 60;
            var rect = new Rectangle(Offset.X, Offset.Y, Offset.X + canvas.Width, Offset.Y + canvas.Height);

            for (int x = 0; x < gameSize; x += bigBox)
            {
                for (int y = 0; y < gameSize; y += bigBox)
                {
                    context.StrokeRect(x * squareSize, y * squareSize, squareSize * bigBox, squareSize * bigBox);
                }
            }
            context.Restore();


            foreach (var playerCluster in clusters)
            {
                var vector2s = playerCluster.Players.Select(a => new Vector2(a.X, a.Y));

                var box = BoundingBox.CreateFromPoints(vector2s);

                var center = new Vector2(box.Min.X + ((box.Max.X - box.Min.X) / 2), box.Min.Y + ((box.Max.Y - box.Min.Y) / 2));

                var polyRect = new Rectangle(box.Min.X * squareSize, box.Min.Y * squareSize, box.Max.X * squareSize, box.Max.Y * squareSize);


                if (!rect.intersects(polyRect))
                {
                    continue;
                }

                var vecs = vector2s.OrderBy(a =>
                {
                    return Math.Atan2(a.Y - center.Y, a.X - center.X);
                });


                context.Save();
                context.StrokeStyle = context.FillStyle = playerCluster.Color;
                context.LineWidth = 6;
                var lastPlayer = vecs[0];
                context.BeginPath();
                context.MoveTo(lastPlayer.X * squareSize + squareSize / 2, lastPlayer.Y * squareSize + squareSize / 2);
                for (int index = 0; index < vecs.Length; index++)
                {
                    var player = vecs[index];
                    context.FillRect(player.X * squareSize - (squareSize) / 2, player.Y * squareSize - (squareSize) / 2, squareSize*2, squareSize*2);
                    context.LineTo(player.X * squareSize + squareSize / 2, player.Y * squareSize + squareSize / 2);
                }
                context.ClosePath();
                if (drawLines)
                {
                    context.Stroke();
                }
                context.Restore();

                context.Save();
                context.Font = "30px Arial";
                if (vecs.Length > 2)
                {
                    context.FillText(vecs.Length.ToString(), center.X * squareSize + squareSize / 2, center.Y * squareSize + squareSize / 2);
                }
                context.Restore();
            }
            context.Restore();

        }


        public static void buildClusters(int viewRadius)
        {
  
            clusters = ClusterTree(tree, players, viewRadius);
     
/*

            Console.WriteLine(string.Format("Clusters {0}", clusters.Count));
            for (int i = 1; i <= MaxClusterSize; i++)
            {
                Console.WriteLine(string.Format("Clusters with {1} {0}", clusters.Count(a => a.Players.Count == i), i));
            }

            clusters.Sort((a, b) =>
            {
                return b.Players.Count - a.Players.Count;
            });

            for (int i = 0; i < clusters.Count; i++)
            {
                if (clusters[i].Players.Count <= MaxClusterSize) continue;
                Console.WriteLine(string.Format("Cluster[{0}] Size {1}", i + 1, clusters[i].Players.Count));
            }
*/


            List<PlayerClusterGroup> playerClusterGroups = new List<PlayerClusterGroup>();
            List<PlayerCluster> clonePlayerClusters = new List<PlayerCluster>(clusters.OrderBy(a=>-a.Players.Count));


            while (clonePlayerClusters.Count > 0)
            {

                PlayerClusterGroup currentPlayerCluster = new PlayerClusterGroup();

                for (int index = clonePlayerClusters.Count - 1; index >= 0; index--)
                {
                    var clonePlayerCluster = clonePlayerClusters[index];
                    if (currentPlayerCluster.NumberOfPlayers + clonePlayerCluster.Players.Count <= MaxClusterSize)
                    {
                        currentPlayerCluster.PlayerClusters.Add(clonePlayerCluster);
                        currentPlayerCluster.NumberOfPlayers += clonePlayerCluster.Players.Count;
                        clonePlayerClusters.RemoveAt(index);


                        if (currentPlayerCluster.NumberOfPlayers == MaxClusterSize)
                        {
                            break;
                        }
                    }
                }
                    playerClusterGroups.Add(currentPlayerCluster);
            }

     /*       foreach (var playerClusterGroup in playerClusterGroups)
            {

                var color = playerClusterGroup.PlayerClusters[0].Color;

                foreach (var playerCluster in playerClusterGroup.PlayerClusters)
                    playerCluster.Color = color;

                Console.WriteLine(string.Format("Number Of Clusters: {0}, Number Of Players: {1}", playerClusterGroup.PlayerClusters.Count, playerClusterGroup.NumberOfPlayers));
            }

            Console.WriteLine(string.Format("Number Of Cluster Groups: {0}", playerClusterGroups.Count));*/
        }


        private static List<PlayerCluster> ClusterTree(RTree<Player> tree, List<Player> players, int viewRadius)
        {
            var playerClusterInformations = buildPlayerClusterInformations(tree, players, viewRadius);

            var playerClusters = buildPlayerClusters(players, playerClusterInformations);
            return playerClusters;

        }

        private static List<PlayerCluster> buildPlayerClusters(List<Player> players, Dictionary<Player, PlayerClusterInfo> playerClusterInformations)
        {
            JsDictionary<int, Player> hitPlayers = players.ToDictionary(a => a.Id);
            List<PlayerCluster> playerClusters = new List<PlayerCluster>();
            int hitPlayerCount = players.Count;


            var playerClusterInfoHits = new JsDictionary<int, PlayerClusterInfo>();
            var playerClusterInfoHitsArray = new List<PlayerClusterInfo>();

            while (hitPlayerCount > 0)
            {
                playerClusterInfoHits.Clear();
                playerClusterInfoHitsArray.Clear();

                GetPlayerCluster(playerClusterInfoHits, playerClusterInfoHitsArray, playerClusterInformations, playerClusterInformations[hitPlayers[hitPlayers.Keys.First()]], hitPlayers);
                PlayerCluster cluster = new PlayerCluster();
                for (int index = 0; index < playerClusterInfoHitsArray.Count; index++)
                {
                    var playerClusterInfoHit = playerClusterInfoHitsArray[index];
                    cluster.Players.Add(playerClusterInfoHit.Player);
                    hitPlayers.Remove(playerClusterInfoHit.Player.Id);
                    hitPlayerCount--;
                }
                
                playerClusters.Add(cluster);

//                Console.WriteLine(string.Format("Players Left: {0}, Clusters Total: {1} ", hitPlayerCount, playerClusters.Count));
            }
            return playerClusters;
        }

        private static Dictionary<Player, PlayerClusterInfo> buildPlayerClusterInformations(RTree<Player> tree, List<Player> players, int viewRadius)
        {
            Dictionary<Player, PlayerClusterInfo> playerClusterInformations = new Dictionary<Player, PlayerClusterInfo>();

            for (int index = 0; index < players.Count; index++)
            {
                var currentPlayer = players[index];
                List<Player> nearest = tree.Nearest(new Point(currentPlayer.X, currentPlayer.Y), viewRadius);

                PlayerClusterInfo playerClusterInfo = new PlayerClusterInfo(currentPlayer);

                for (int i = 0; i < nearest.Count; i++)
                {
                    var nearPlayer = nearest[i];
                    if (nearPlayer == currentPlayer) continue;
                    playerClusterInfo.Neighbors.Add(new Tuple<double, Player>(pointDistance(nearPlayer, currentPlayer), nearPlayer));
                }

                playerClusterInformations.Add(currentPlayer, playerClusterInfo);
            }
            return playerClusterInformations;
        }


        private static void GetPlayerCluster(JsDictionary<int, PlayerClusterInfo> playerClusterInfoHits, List<PlayerClusterInfo> playerClusterInfoHitsArray, Dictionary<Player, PlayerClusterInfo> allPlayerClusterInformations, PlayerClusterInfo currentPlayerClusterInfo, JsDictionary<int, Player> hitPlayers)
        {

            List<Tuple<double, PlayerClusterInfo>> neighbors = new List<Tuple<double, PlayerClusterInfo>>();
            neighbors.Add(new Tuple<double, PlayerClusterInfo>(0, currentPlayerClusterInfo));
            int totalPlayers = 0;
            while (neighbors.Count > 0)
            {
                var activePlayerClusterInfo = neighbors[0];


                if (!hitPlayers.ContainsKey(activePlayerClusterInfo.Item2.Player.Id) || playerClusterInfoHits.ContainsKey(activePlayerClusterInfo.Item2.Player.Id))
                {
                    neighbors.Remove(activePlayerClusterInfo);
                    continue;
                }
                playerClusterInfoHits[activePlayerClusterInfo.Item2.Player.Id] = activePlayerClusterInfo.Item2;
                playerClusterInfoHitsArray.Add(activePlayerClusterInfo.Item2);
                totalPlayers++;
                if (totalPlayers == MaxClusterSize) return;
                foreach (Tuple<double, Player> playerNeighbor in activePlayerClusterInfo.Item2.Neighbors)
                {
                    neighbors.Add(new Tuple<double, PlayerClusterInfo>(playerNeighbor.Item1,allPlayerClusterInformations[playerNeighbor.Item2]));
                }
                neighbors.Remove(activePlayerClusterInfo);

                neighbors.Sort((a, b) => (int)(a.Item1 - b.Item1));
                if (neighbors.Count > 100)
                {
                    neighbors.RemoveRange(100, neighbors.Count - 100);
                }

                
            }


        }

        private static double pointDistance(Player nearPlayer, Player currentPlayer)
        {
            return (Math.Pow(currentPlayer.X - nearPlayer.X, 2) + Math.Pow(currentPlayer.Y - nearPlayer.Y, 2));

        }
    }

    internal class PlayerClusterInfo
    {
        public PlayerClusterInfo(Player player)
        {
            Player = player;
            Neighbors = new List<Tuple<double, Player>>();
        }

        public Player Player { get; set; }
        public List<Tuple<double, Player>> Neighbors { get; set; }
    }

    public class PlayerCluster
    {
        public PlayerCluster()
        {
            Players = new List<Player>();
            Color = randomColor();
        }
        public string Color { get; set; }
        public List<Player> Players { get; set; }
        private string randomColor()
        {
            return String.Format("#{0:X6}", Program.rand.Next(0x1000000));
        }

    }

    public class Player
    {
        public override int GetHashCode()
        {
            return Id;
        }

        public int Id { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public Player(int id)
        {
            Id = id;
        }
    }
    public class PlayerClusterGroup
    {
        public PlayerClusterGroup()
        {
            PlayerClusters = new List<PlayerCluster>();
            NumberOfPlayers = 0;
        }

        public int NumberOfPlayers { get; set; }
        public List<PlayerCluster> PlayerClusters { get; set; }
    }



    [Imported(ObeysTypeSystem = true)]
    [ScriptNamespace("ss")]
    public static class Console
    {
        [InlineCode("console.profile()")]
        public static void Profile()
        {
        }

        [InlineCode("console.profileEnd()")]
        public static void ProfileEnd()
        {
        }

        [InlineCode("console.log({message})")]
        public static void WriteLine(string message)
        {
        }
    }

}

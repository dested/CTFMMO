using System.Runtime.CompilerServices;
using CTFMMO.Server.Libraries.NodeJS;

namespace CTFMMO.Server.Libraries.Socket.IO
{
    [IgnoreNamespace]
    [Imported()]
    [ModuleName("socket.io")]
    [GlobalMethods]
    public static class SocketIO
    {
        public static SocketIOClient Listen(HttpServer app)
        {
            return null;
        }
    }
}
using System.Runtime.CompilerServices;

namespace CTFMMO.Server.Libraries.NodeJS
{
    [IgnoreNamespace]
    [Imported()]
    public class HttpServer
    {
        [ScriptName("listen")]
        public object Listen(int port)
        {
            return null;
        }
    }
}
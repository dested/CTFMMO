using System.Runtime.CompilerServices;
using CTFMMO.Server.Libraries.NodeJS;

namespace CTFMMO.Server.Libraries.Redis
{
    [Imported( )]
    [IgnoreNamespace]
    [ModuleName("redis")]
    //[GlobalMethods]
    public class RedisModule : NodeModule
    {
        [ScriptName("debug_mode")] public bool DebugMode;

        public RedisClient CreateClient(int port, string ip)
        {
            return null;
        }
    }
}
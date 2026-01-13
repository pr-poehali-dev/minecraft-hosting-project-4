import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { authService, serverService, Server } from '@/lib/auth';
import { Separator } from '@/components/ui/separator';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  children?: FileItem[];
}

const mockFiles: FileItem[] = [
  {
    name: 'plugins',
    type: 'folder',
    children: [
      { name: 'EssentialsX.jar', type: 'file', size: '2.3 MB' },
      { name: 'WorldEdit.jar', type: 'file', size: '5.1 MB' }
    ]
  },
  {
    name: 'worlds',
    type: 'folder',
    children: [
      { name: 'world', type: 'folder', children: [] },
      { name: 'world_nether', type: 'folder', children: [] }
    ]
  },
  { name: 'server.properties', type: 'file', size: '1.2 KB' },
  { name: 'bukkit.yml', type: 'file', size: '845 B' },
  { name: 'spigot.yml', type: 'file', size: '1.5 KB' }
];

export default function ServerPanel() {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [server, setServer] = useState<Server | null>(null);
  const [consoleLog, setConsoleLog] = useState<string[]>([]);
  const [consoleInput, setConsoleInput] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(1200);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !serverId) {
      navigate('/');
      return;
    }
    
    const serverData = serverService.getServer(serverId);
    if (!serverData) {
      navigate('/dashboard');
      return;
    }
    
    setServer(serverData);
  }, [user, serverId, navigate]);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLog]);

  const startServer = () => {
    if (!server) return;
    
    serverService.updateServerStatus(server.id, 'starting');
    setServer({ ...server, status: 'starting' });
    setConsoleLog(['[Hosting.ru] Starting server...']);

    const startupMessages = [
      '[19:32:15] [Server thread/INFO]: Starting minecraft server version 1.20.1',
      '[19:32:15] [Server thread/INFO]: Loading properties',
      '[19:32:16] [Server thread/INFO]: Default game type: SURVIVAL',
      '[19:32:16] [Server thread/INFO]: Generating keypair',
      '[19:32:17] [Server thread/INFO]: Starting Minecraft server on *:25565',
      '[19:32:18] [Server thread/INFO]: Preparing level "world"',
      '[19:32:20] [Server thread/INFO]: Preparing spawn area: 0%',
      '[19:32:21] [Server thread/INFO]: Preparing spawn area: 12%',
      '[19:32:22] [Server thread/INFO]: Preparing spawn area: 25%',
      '[19:32:23] [Server thread/INFO]: Preparing spawn area: 41%',
      '[19:32:24] [Server thread/INFO]: Preparing spawn area: 58%',
      '[19:32:25] [Server thread/INFO]: Preparing spawn area: 73%',
      '[19:32:26] [Server thread/INFO]: Preparing spawn area: 89%',
      '[19:32:27] [Server thread/INFO]: Preparing spawn area: 97%',
      '[19:32:28] [Server thread/INFO]: Time elapsed: 8275 ms',
      '[19:32:28] [Server thread/INFO]: Done! For help, type "help"'
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < startupMessages.length) {
        setConsoleLog(prev => [...prev, startupMessages[index]]);
        index++;
        
        setCpuUsage(Math.min(45 + index * 2, 75));
        setRamUsage(Math.min(1200 + index * 50, 1800));
      } else {
        clearInterval(interval);
        serverService.updateServerStatus(server.id, 'online');
        setServer({ ...server, status: 'online' });
        setConsoleLog(prev => [...prev, '[Hosting.ru] Server is now ONLINE']);
      }
    }, 1600);
  };

  const stopServer = () => {
    if (!server) return;
    
    serverService.updateServerStatus(server.id, 'stopping');
    setServer({ ...server, status: 'stopping' });
    setConsoleLog(prev => [...prev, '[19:45:00] [Server thread/INFO]: Stopping the server']);
    setConsoleLog(prev => [...prev, '[19:45:01] [Server thread/INFO]: Stopping server']);
    setConsoleLog(prev => [...prev, '[19:45:02] [Server thread/INFO]: Saving worlds']);

    setTimeout(() => {
      serverService.updateServerStatus(server.id, 'offline');
      setServer({ ...server, status: 'offline' });
      setConsoleLog(prev => [...prev, '[19:45:03] [Server thread/INFO]: Server closed']);
      setConsoleLog(prev => [...prev, '[Hosting.ru] Server is now OFFLINE']);
      setCpuUsage(0);
      setRamUsage(0);
    }, 3000);
  };

  const restartServer = () => {
    stopServer();
    setTimeout(() => {
      startServer();
    }, 3500);
  };

  const sendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;
    
    const timestamp = new Date().toTimeString().split(' ')[0];
    setConsoleLog(prev => [...prev, `[${timestamp}] [Console/CMD]: ${consoleInput}`]);
    
    if (consoleInput === 'list') {
      setConsoleLog(prev => [...prev, `[${timestamp}] [Server thread/INFO]: There are 0 of a max of ${server?.maxPlayers} players online:`]);
    } else if (consoleInput.startsWith('say ')) {
      const message = consoleInput.substring(4);
      setConsoleLog(prev => [...prev, `[${timestamp}] [Server thread/INFO]: [Server] ${message}`]);
    } else {
      setConsoleLog(prev => [...prev, `[${timestamp}] [Server thread/INFO]: Command executed`]);
    }
    
    setConsoleInput('');
  };

  const getCurrentFiles = (): FileItem[] => {
    let current = mockFiles;
    for (const path of currentPath) {
      const folder = current.find(f => f.name === path && f.type === 'folder');
      if (folder && folder.children) {
        current = folder.children;
      }
    }
    return current;
  };

  const openFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const goBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  if (!server) return null;

  const ramPercent = (ramUsage / 2048) * 100;
  const diskUsage = 15;
  const maxRam = parseInt(server.ram.split(' ')[0]) * 1024;
  const diskMax = parseInt(server.storage.split(' ')[0]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Server" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <div className="font-heading font-bold">{server.name}</div>
                <div className="text-xs text-muted-foreground">{server.ip}:{server.port}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={startServer} 
              disabled={server.status === 'online' || server.status === 'starting'}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Icon name="Play" size={16} className="mr-2" />
              Старт
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={restartServer}
              disabled={server.status === 'offline' || server.status === 'starting' || server.status === 'stopping'}
            >
              <Icon name="RotateCw" size={16} className="mr-2" />
              Рестарт
            </Button>
            <Button 
              size="sm" 
              onClick={stopServer}
              disabled={server.status === 'offline' || server.status === 'stopping'}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Icon name="Square" size={16} className="mr-2" />
              Стоп
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs defaultValue="console" className="space-y-6">
          <TabsList>
            <TabsTrigger value="console">
              <Icon name="Terminal" size={16} className="mr-2" />
              Консоль
            </TabsTrigger>
            <TabsTrigger value="files">
              <Icon name="FolderTree" size={16} className="mr-2" />
              Файлы
            </TabsTrigger>
            <TabsTrigger value="monitoring">
              <Icon name="Activity" size={16} className="mr-2" />
              Мониторинг
            </TabsTrigger>
            <TabsTrigger value="ftp">
              <Icon name="HardDrive" size={16} className="mr-2" />
              SFTP/FTP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="console" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Консоль сервера</CardTitle>
                <CardDescription>Управление сервером через команды</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full rounded-md border bg-black p-4 font-mono text-sm">
                  <div className="space-y-1">
                    {consoleLog.length === 0 ? (
                      <div className="text-gray-500">Запустите сервер для просмотра логов...</div>
                    ) : (
                      consoleLog.map((log, i) => (
                        <div key={i} className="text-gray-300">{log}</div>
                      ))
                    )}
                    <div ref={consoleEndRef} />
                  </div>
                </ScrollArea>

                <form onSubmit={sendCommand} className="mt-4 flex gap-2">
                  <Input
                    placeholder="Введите команду..."
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    disabled={server.status !== 'online'}
                    className="font-mono"
                  />
                  <Button type="submit" disabled={server.status !== 'online'}>
                    <Icon name="Send" size={16} />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Файловый менеджер</CardTitle>
                <CardDescription>Управление файлами сервера</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {currentPath.length > 0 && (
                      <Button variant="outline" size="sm" onClick={goBack}>
                        <Icon name="ArrowLeft" size={16} className="mr-2" />
                        Назад
                      </Button>
                    )}
                    <div className="text-sm text-muted-foreground">
                      /{currentPath.join('/')}
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    {getCurrentFiles().map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer border-b last:border-0"
                        onClick={() => file.type === 'folder' && openFolder(file.name)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon 
                            name={file.type === 'folder' ? 'Folder' : 'FileText'} 
                            size={20} 
                            className={file.type === 'folder' ? 'text-primary' : 'text-muted-foreground'}
                          />
                          <div>
                            <div className="font-medium">{file.name}</div>
                            {file.size && <div className="text-xs text-muted-foreground">{file.size}</div>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {file.type === 'file' && (
                            <>
                              <Button variant="ghost" size="sm">
                                <Icon name="Eye" size={16} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Icon name="Download" size={16} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Icon name="Edit" size={16} />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Процессор</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Использование CPU</span>
                      <span className="font-medium">{cpuUsage}%</span>
                    </div>
                    <Progress value={cpuUsage} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Оперативная память</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Использование RAM</span>
                      <span className="font-medium">{ramUsage} MB / {maxRam} MB</span>
                    </div>
                    <Progress value={ramPercent} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Диск</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Использование диска</span>
                      <span className="font-medium">{diskUsage} GB / {diskMax} GB</span>
                    </div>
                    <Progress value={(diskUsage / diskMax) * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Сеть</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Входящий трафик</span>
                      <span className="font-medium">12.5 MB/s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Исходящий трафик</span>
                      <span className="font-medium">8.3 MB/s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ftp" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">SFTP / FTP доступ</CardTitle>
                <CardDescription>Данные для подключения к серверу</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">SFTP хост</div>
                    <div className="flex gap-2">
                      <Input value={`sftp.hosting.ru`} readOnly />
                      <Button variant="outline" size="sm">
                        <Icon name="Copy" size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Порт</div>
                    <div className="flex gap-2">
                      <Input value="22" readOnly />
                      <Button variant="outline" size="sm">
                        <Icon name="Copy" size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Логин</div>
                    <div className="flex gap-2">
                      <Input value={`server_${server.id}`} readOnly />
                      <Button variant="outline" size="sm">
                        <Icon name="Copy" size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Пароль</div>
                    <div className="flex gap-2">
                      <Input value="••••••••••••" readOnly type="password" />
                      <Button variant="outline" size="sm">
                        <Icon name="Eye" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">FTP хост</div>
                  <div className="flex gap-2">
                    <Input value={`ftp.hosting.ru`} readOnly />
                    <Button variant="outline" size="sm">
                      <Icon name="Copy" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <div className="flex gap-2">
                    <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900 mb-1">Рекомендуем использовать SFTP</div>
                      <div className="text-blue-700">SFTP более безопасен и работает быстрее чем обычный FTP</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

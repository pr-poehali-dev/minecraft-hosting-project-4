import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { authService, serverService, Server } from '@/lib/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    loadServers();
  }, [user, navigate]);

  const loadServers = () => {
    if (user) {
      const userServers = serverService.getUserServers(user.id);
      setServers(userServers);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const getStatusColor = (status: Server['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      case 'starting':
        return 'bg-yellow-500 animate-pulse';
      case 'stopping':
        return 'bg-orange-500 animate-pulse';
    }
  };

  const getStatusText = (status: Server['status']) => {
    switch (status) {
      case 'online':
        return 'Онлайн';
      case 'offline':
        return 'Офлайн';
      case 'starting':
        return 'Запуск...';
      case 'stopping':
        return 'Остановка...';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Box" size={20} className="text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">hosting.ru</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              <Icon name="User" size={16} className="mr-2" />
              {user.name}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold mb-2">Мои серверы</h1>
            <p className="text-muted-foreground">Управление вашими Minecraft серверами</p>
          </div>
          <Button onClick={() => navigate('/')}>
            <Icon name="Plus" size={16} className="mr-2" />
            Купить сервер
          </Button>
        </div>

        {servers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Icon name="Server" size={64} className="text-muted-foreground mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Нет серверов</h3>
              <p className="text-muted-foreground mb-4">Купите свой первый сервер, чтобы начать</p>
              <Button onClick={() => navigate('/')}>
                <Icon name="Plus" size={16} className="mr-2" />
                Купить сервер
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <Card key={server.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/server/${server.id}`)}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="font-heading">{server.name}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`}></div>
                  </div>
                  <CardDescription>
                    <Badge variant="secondary">{server.plan}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Статус</span>
                    <span className="font-medium">{getStatusText(server.status)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Домен</span>
                    <span className="font-mono font-medium text-xs">{server.domain}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">IP:Порт</span>
                    <span className="font-mono font-medium">{server.ip}:{server.port}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Мир</span>
                    <span className="font-medium">{server.world}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">RAM</span>
                    <span className="font-medium">{server.ram}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
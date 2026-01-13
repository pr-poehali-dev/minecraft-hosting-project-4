import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { authService, serverService } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [servers, setServers] = useState(serverService.getUserServers(user?.id || ''));
  const [coOwnerEmail, setCoOwnerEmail] = useState('');
  const [selectedServer, setSelectedServer] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAddCoOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer || !coOwnerEmail) return;
    
    const success = serverService.addCoOwner(selectedServer, coOwnerEmail);
    if (success) {
      setCoOwnerEmail('');
      alert('Совладелец успешно добавлен!');
    } else {
      alert('Пользователь не найден');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Box" size={20} className="text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">hosting.ru</span>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        <h1 className="font-heading text-3xl font-bold mb-8">Профиль</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Личная информация</CardTitle>
              <CardDescription>Ваши данные аккаунта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input value={user.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user.email} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>ID пользователя</Label>
                  <Input value={user.id} readOnly className="font-mono text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Управление совладельцами</CardTitle>
              <CardDescription>
                Добавьте других пользователей для совместного управления серверами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCoOwner} className="space-y-4">
                <div className="space-y-2">
                  <Label>Выберите сервер</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={selectedServer}
                    onChange={(e) => setSelectedServer(e.target.value)}
                    required
                  >
                    <option value="">Выберите сервер...</option>
                    {servers.filter(s => s.ownerId === user.id).map(server => (
                      <option key={server.id} value={server.id}>
                        {server.name} ({server.plan})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Email совладельца</Label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={coOwnerEmail}
                    onChange={(e) => setCoOwnerEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit">
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Добавить совладельца
                </Button>
              </form>

              {servers.filter(s => s.ownerId === user.id && s.coOwners.length > 0).length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <h4 className="font-medium">Текущие совладельцы</h4>
                    {servers.filter(s => s.ownerId === user.id).map(server => (
                      server.coOwners.length > 0 && (
                        <div key={server.id} className="space-y-2">
                          <div className="text-sm font-medium">{server.name}</div>
                          <div className="flex flex-wrap gap-2">
                            {server.coOwners.map(coOwnerId => (
                              <Badge key={coOwnerId} variant="secondary">
                                ID: {coOwnerId}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 h-4 w-4 p-0"
                                  onClick={() => {
                                    serverService.removeCoOwner(server.id, coOwnerId);
                                    setServers(serverService.getUserServers(user.id));
                                  }}
                                >
                                  <Icon name="X" size={12} />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{servers.length}</div>
                  <div className="text-sm text-muted-foreground">Всего серверов</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">
                    {servers.filter(s => s.status === 'online').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Активных серверов</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

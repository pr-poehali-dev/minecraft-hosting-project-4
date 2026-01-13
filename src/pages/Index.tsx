import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Box" size={20} className="text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">hosting.ru</span>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Главная
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Тарифы
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Возможности
            </button>
            <button 
              onClick={() => scrollToSection('status')} 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Статус
            </button>
          </nav>

          <Button size="sm">
            <Icon name="LogIn" size={16} className="mr-2" />
            Войти
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 md:py-32">
        <div className="container px-4">
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="px-4 py-1">
              <Icon name="Zap" size={14} className="mr-2" />
              Лучший хостинг для Minecraft
            </Badge>
            
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
              Запусти свой сервер <span className="text-primary">Minecraft</span> за минуту
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Профессиональный хостинг с мощной панелью управления, высокой производительностью 
              и круглосуточной поддержкой. Без скрытых платежей.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" onClick={() => scrollToSection('pricing')}>
                <Icon name="Rocket" size={20} className="mr-2" />
                Начать бесплатно
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                <Icon name="PlayCircle" size={20} className="mr-2" />
                Смотреть демо
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="font-heading text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Серверов</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Поддержка</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-secondary/50">
        <div className="container px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary">Тарифы</Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Выберите свой план</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Гибкие тарифы для любых задач — от небольших серверов до крупных проектов
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="animate-scale-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="font-heading">Starter</CardTitle>
                  <Icon name="Sparkles" size={20} className="text-primary" />
                </div>
                <CardDescription>Для небольших серверов</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-heading text-4xl font-bold">299₽</span>
                  <span className="text-muted-foreground">/месяц</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">2 ГБ RAM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">20 ГБ SSD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">До 10 игроков</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">Базовая поддержка</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Выбрать план</Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="animate-scale-in border-primary shadow-lg relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Популярный</Badge>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="font-heading">Pro</CardTitle>
                  <Icon name="Flame" size={20} className="text-primary" />
                </div>
                <CardDescription>Для активных серверов</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-heading text-4xl font-bold">599₽</span>
                  <span className="text-muted-foreground">/месяц</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">4 ГБ RAM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">50 ГБ SSD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">До 50 игроков</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">Приоритетная поддержка</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">Автобэкапы</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Выбрать план</Button>
              </CardFooter>
            </Card>

            {/* Ultimate Plan */}
            <Card className="animate-scale-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="font-heading">Ultimate</CardTitle>
                  <Icon name="Crown" size={20} className="text-primary" />
                </div>
                <CardDescription>Для крупных проектов</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-heading text-4xl font-bold">1299₽</span>
                  <span className="text-muted-foreground">/месяц</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">8 ГБ RAM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">100 ГБ SSD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">Неограниченно игроков</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">VIP поддержка 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">DDoS защита</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-primary mt-0.5" />
                    <span className="text-sm">Выделенный IP</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Выбрать план</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary">Возможности</Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Всё для управления сервером</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Мощная панель управления с интуитивным интерфейсом
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Console Feature */}
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Terminal" size={20} className="text-primary" />
                  </div>
                  <CardTitle className="font-heading">Продвинутая консоль</CardTitle>
                </div>
                <CardDescription>
                  Управляйте сервером через удобную веб-консоль с подсветкой синтаксиса и автодополнением команд
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">$</span>
                    <span>list</span>
                  </div>
                  <div className="text-muted-foreground">Online players: Steve, Alex, Notch</div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">$</span>
                    <span>say Добро пожаловать!</span>
                  </div>
                  <div className="text-green-600">[Server] Добро пожаловать!</div>
                </div>
              </CardContent>
            </Card>

            {/* Player Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Users" size={20} className="text-primary" />
                  </div>
                  <CardTitle className="font-heading">Управление игроками</CardTitle>
                </div>
                <CardDescription>
                  Полный контроль над игроками: баны, киски, привилегии и детальная статистика
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {['Steve', 'Alex', 'Notch'].map((player, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/20"></div>
                        <div>
                          <div className="font-medium text-sm">{player}</div>
                          <div className="text-xs text-muted-foreground">Online 2ч 30м</div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Icon name="MoreVertical" size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* File Manager */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="FolderTree" size={20} className="text-primary" />
                  </div>
                  <CardTitle className="font-heading">Файловый менеджер</CardTitle>
                </div>
                <CardDescription>
                  Редактируйте конфиги, загружайте моды и плагины прямо из браузера
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                    <Icon name="Folder" size={16} className="text-primary" />
                    <span>plugins</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                    <Icon name="Folder" size={16} className="text-primary" />
                    <span>worlds</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <span>server.properties</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monitoring */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Activity" size={20} className="text-primary" />
                  </div>
                  <CardTitle className="font-heading">Мониторинг в реальном времени</CardTitle>
                </div>
                <CardDescription>
                  Следите за производительностью: CPU, RAM, TPS и онлайн игроков
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU</span>
                      <span className="text-primary font-medium">45%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[45%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>RAM</span>
                      <span className="text-primary font-medium">2.1 / 4 GB</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[52%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>TPS</span>
                      <span className="text-green-600 font-medium">20.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section id="status" className="py-20 bg-secondary/50">
        <div className="container px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary">Статус серверов</Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Мониторинг инфраструктуры</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Отслеживайте работу наших серверов в реальном времени
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              { name: 'Игровые серверы', status: 'operational', uptime: '99.98%' },
              { name: 'Панель управления', status: 'operational', uptime: '99.95%' },
              { name: 'API', status: 'operational', uptime: '99.99%' },
              { name: 'Система бэкапов', status: 'operational', uptime: '100%' },
              { name: 'DDoS защита', status: 'operational', uptime: '100%' }
            ].map((service, i) => (
              <Card key={i} className="animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">Работает стабильно</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Uptime {service.uptime}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Box" size={20} className="text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl">hosting.ru</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 hosting.ru. Все права защищены.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">
                Документация
              </Button>
              <Button variant="ghost" size="sm">
                Поддержка
              </Button>
              <Button variant="ghost" size="sm">
                Контакты
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import AuthModal from '@/components/AuthModal';
import PurchaseModal from '@/components/PurchaseModal';
import { authService } from '@/lib/auth';

export default function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const handlePlanSelect = (plan: { name: string; price: string }) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedPlan(plan);
    setPurchaseModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setUser(authService.getCurrentUser());
  };

  const handlePurchaseSuccess = () => {
    navigate('/dashboard');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur">
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
              onClick={() => scrollToSection('status')} 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Статус
            </button>
          </nav>

          {user ? (
            <Button size="sm" onClick={() => navigate('/dashboard')}>
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Панель
            </Button>
          ) : (
            <Button size="sm" onClick={() => setAuthModalOpen(true)}>
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/30">
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
                Начать сейчас
              </Button>
              <Button size="lg" variant="outline" className="text-base" onClick={() => user ? navigate('/dashboard') : setAuthModalOpen(true)}>
                <Icon name="LayoutDashboard" size={20} className="mr-2" />
                {user ? 'Моя панель' : 'Демо'}
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
      <section id="pricing" className="py-20 bg-secondary/30">
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
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handlePlanSelect({ name: 'Starter', price: '299₽' })}
                >
                  Выбрать план
                </Button>
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
                <Button 
                  className="w-full"
                  onClick={() => handlePlanSelect({ name: 'Pro', price: '599₽' })}
                >
                  Выбрать план
                </Button>
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
                  <li className="flex items-center gap-2">
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
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handlePlanSelect({ name: 'Ultimate', price: '1299₽' })}
                >
                  Выбрать план
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section id="status" className="py-20">
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
              { name: 'Игровые серверы', uptime: '99.98%' },
              { name: 'Панель управления', uptime: '99.95%' },
              { name: 'API', uptime: '99.99%' },
              { name: 'Система бэкапов', uptime: '100%' },
              { name: 'DDoS защита', uptime: '100%' }
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
                    <Badge variant="secondary">Uptime {service.uptime}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card">
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
          </div>
        </div>
      </footer>

      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {user && (
        <PurchaseModal
          open={purchaseModalOpen}
          onClose={() => setPurchaseModalOpen(false)}
          plan={selectedPlan}
          userId={user.id}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
}

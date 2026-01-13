export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Server {
  id: string;
  name: string;
  plan: string;
  ram: string;
  storage: string;
  maxPlayers: string;
  ip: string;
  port: number;
  status: 'online' | 'offline' | 'starting' | 'stopping';
  ownerId: string;
  coOwners: string[];
  createdAt: Date;
}

const USERS_KEY = 'hosting_users';
const CURRENT_USER_KEY = 'hosting_current_user';
const SERVERS_KEY = 'hosting_servers';

export const authService = {
  register: (email: string, password: string, name: string): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return null;
    }

    const newUser: User & { password: string } = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      password
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  login: (email: string, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  }
};

export const serverService = {
  createServer: (userId: string, plan: string): Server => {
    const servers = JSON.parse(localStorage.getItem(SERVERS_KEY) || '[]');
    
    const planConfig: Record<string, { ram: string; storage: string; maxPlayers: string }> = {
      'Starter': { ram: '2 GB', storage: '20 GB', maxPlayers: '10' },
      'Pro': { ram: '4 GB', storage: '50 GB', maxPlayers: '50' },
      'Ultimate': { ram: '8 GB', storage: '100 GB', maxPlayers: 'Неограниченно' }
    };

    const config = planConfig[plan];
    
    const newServer: Server = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Server ${servers.length + 1}`,
      plan,
      ram: config.ram,
      storage: config.storage,
      maxPlayers: config.maxPlayers,
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: 25565,
      status: 'offline',
      ownerId: userId,
      coOwners: [],
      createdAt: new Date()
    };

    servers.push(newServer);
    localStorage.setItem(SERVERS_KEY, JSON.stringify(servers));
    
    return newServer;
  },

  getUserServers: (userId: string): Server[] => {
    const servers = JSON.parse(localStorage.getItem(SERVERS_KEY) || '[]');
    return servers.filter((s: Server) => s.ownerId === userId || s.coOwners.includes(userId));
  },

  getServer: (serverId: string): Server | null => {
    const servers = JSON.parse(localStorage.getItem(SERVERS_KEY) || '[]');
    return servers.find((s: Server) => s.id === serverId) || null;
  },

  updateServerStatus: (serverId: string, status: Server['status']) => {
    const servers = JSON.parse(localStorage.getItem(SERVERS_KEY) || '[]');
    const index = servers.findIndex((s: Server) => s.id === serverId);
    
    if (index !== -1) {
      servers[index].status = status;
      localStorage.setItem(SERVERS_KEY, JSON.stringify(servers));
    }
  },

  addCoOwner: (serverId: string, email: string): boolean => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email);
    
    if (!user) return false;

    const servers = JSON.parse(localStorage.getItem(SERVERS_KEY) || '[]');
    const index = servers.findIndex((s: Server) => s.id === serverId);
    
    if (index !== -1) {
      if (!servers[index].coOwners.includes(user.id)) {
        servers[index].coOwners.push(user.id);
        localStorage.setItem(SERVERS_KEY, JSON.stringify(servers));
      }
      return true;
    }
    
    return false;
  },

  removeCoOwner: (serverId: string, userId: string) => {
    const servers = JSON.parse(localStorage.getItem(SERVERS_KEY) || '[]');
    const index = servers.findIndex((s: Server) => s.id === serverId);
    
    if (index !== -1) {
      servers[index].coOwners = servers[index].coOwners.filter((id: string) => id !== userId);
      localStorage.setItem(SERVERS_KEY, JSON.stringify(servers));
    }
  }
};

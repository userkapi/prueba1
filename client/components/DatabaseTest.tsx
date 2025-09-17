import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { db, sql } from '../lib/database';

export function DatabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [users, setUsers] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError('');

      // Test database connection
      const connectionTest = await db.testConnection();
      
      if (!connectionTest.success) {
        throw new Error(connectionTest.error || 'Connection failed');
      }

      // Fetch users
      const usersData = await sql`SELECT id, username, display_name, avatar_color, created_at FROM users LIMIT 5`;
      setUsers(usersData);

      // Fetch stories
      const storiesData = await db.getStories({ limit: 5 });
      setStories(storiesData);

      setConnectionStatus('connected');
    } catch (err: any) {
      console.error('Database test error:', err);
      setError(err.message);
      setConnectionStatus('error');
    }
  };

  const createTestUser = async () => {
    try {
      const testUser = await db.createUser({
        username: `TestUser${Date.now()}`,
        display_name: `Usuario de Prueba ${Date.now()}`,
        avatar_color: '#FF6B6B',
        is_anonymous: true
      });

      console.log('Test user created:', testUser);
      await testConnection(); // Refresh data
    } catch (err: any) {
      console.error('Error creating test user:', err);
      setError(`Error creating user: ${err.message}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🗄️ Estado de la Base de Datos
          <Badge variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'error' ? 'destructive' : 'secondary'}>
            {connectionStatus === 'connected' && '✅ Conectado'}
            {connectionStatus === 'error' && '❌ Error'}
            {connectionStatus === 'testing' && '🔄 Probando...'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Prueba de conexión y datos de Neon PostgreSQL
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">👥 Usuarios ({users.length})</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: user.avatar_color }}
                  />
                  <span className="font-medium">{user.display_name}</span>
                  <span className="text-gray-500">@{user.username}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📝 Historias ({stories.length})</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {stories.map((story) => (
                <div key={story.id} className="text-sm">
                  <div className="font-medium">{story.display_name || story.username}</div>
                  <div className="text-gray-600 truncate">
                    {story.content.substring(0, 50)}...
                  </div>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {story.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      😊 {story.mood}/5
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={connectionStatus === 'testing'}>
            {connectionStatus === 'testing' ? '🔄 Probando...' : '🔄 Probar Conexión'}
          </Button>
          <Button onClick={createTestUser} variant="outline">
            👤 Crear Usuario de Prueba
          </Button>
        </div>

        {connectionStatus === 'connected' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <strong>✅ Éxito:</strong> La aplicación está conectada correctamente a Neon PostgreSQL.
            Los datos se están guardando y recuperando de la base de datos.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DatabaseTest;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useBasic } from '@basictech/expo';

export default function AuthDebug() {
  const { isLoading, isSignedIn, user, login, signout, db } = useBasic();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      isLoading,
      isSignedIn,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name
      } : null,
      dbAvailable: !!db,
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(info);
    console.log('Auth Debug Info:', info);
  }, [isLoading, isSignedIn, user, db]);

  const testDbConnection = async () => {
    if (!db) {
      console.log('Database not available');
      return;
    }

    try {
      console.log('Testing database connection...');
      const users = await db.from('users').getAll();
      console.log('Database test successful:', users?.length || 0, 'users found');
    } catch (error) {
      console.error('Database test failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Auth Debug Panel</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Loading: {isLoading ? 'Yes' : 'No'}</Text>
        <Text style={styles.infoText}>Signed In: {isSignedIn ? 'Yes' : 'No'}</Text>
        <Text style={styles.infoText}>User Email: {user?.email || 'None'}</Text>
        <Text style={styles.infoText}>User Name: {user?.name || 'None'}</Text>
        <Text style={styles.infoText}>Database: {db ? 'Available' : 'Not Available'}</Text>
        <Text style={styles.infoText}>Last Update: {debugInfo.timestamp}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {!isSignedIn ? (
          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Test Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={signout}>
            <Text style={styles.buttonText}>Test Logout</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.button} onPress={testDbConnection}>
          <Text style={styles.buttonText}>Test Database</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rawData}>
        <Text style={styles.rawDataTitle}>Raw Debug Data:</Text>
        <Text style={styles.rawDataText}>{JSON.stringify(debugInfo, null, 2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rawData: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  rawDataTitle: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rawDataText: {
    color: '#cccccc',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
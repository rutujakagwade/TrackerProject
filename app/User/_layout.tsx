import { Stack } from 'expo-router';

const UserLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
};

export default UserLayout;
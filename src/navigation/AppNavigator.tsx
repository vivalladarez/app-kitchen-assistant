import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { LoadingScreen } from '../components/LoadingScreen';
import { useRecipes } from '../context/RecipeContext';
import { useSettings } from '../context/SettingsContext';
import {
  CheckIngredientsScreen,
  CreateRecipeScreen,
  DialogModeScreen,
  EditRecipeScreen,
  FavoritesScreen,
  HomeScreen,
  RecipeScreen,
  RegisterScreen,
  SearchScreen,
  SettingsScreen,
} from '../screens';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function NavigationRoot() {
  const { theme, isReady: settingsReady } = useSettings();
  const { isReady: recipesReady } = useRecipes();
  const { colors } = theme;

  if (!settingsReady || !recipesReady) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: colors.headerText,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Cozinha Assistiva' }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: 'Buscar receitas' }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ title: 'Receitas favoritas' }}
        />
        <Stack.Screen
          name="Recipe"
          component={RecipeScreen}
          options={{ title: 'Receita' }}
        />
        <Stack.Screen
          name="CheckIngredients"
          component={CheckIngredientsScreen}
          options={{ title: 'Conferir ingredientes' }}
        />
        <Stack.Screen
          name="DialogMode"
          component={DialogModeScreen}
          options={{ title: 'Modo diálogo' }}
        />
        <Stack.Screen
          name="EditRecipe"
          component={EditRecipeScreen}
          options={{ title: 'Editar receita' }}
        />
        <Stack.Screen
          name="CreateRecipe"
          component={CreateRecipeScreen}
          options={{ title: 'Criar receita' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Configurações' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Cadastro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function AppNavigator() {
  return <NavigationRoot />;
}

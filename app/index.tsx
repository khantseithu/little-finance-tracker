import { Text, View } from "react-native";
import { Button } from 'react-native-paper';
export default function Index() {
  return (
    <Button mode="contained" onPress={() => console.log('Pressed')}>
      Press me
    </Button>
  );
}


import React, { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { Button, Linking, Text, TouchableOpacity, View } from "react-native";
import useAmplify from "../hooks/useAmplify";

function App() {
  const [folders, setFolders] = useState<Array<Schema["Folder"]["type"]>>([]);
  const { client } = useAmplify();

  useEffect(() => {
    if (client?.models?.Folder) {
      client.models.Folder.observeQuery().subscribe({
        next: (data) => setFolders([...data.items]),
      });
    }
  }, [client?.models?.Folder]);

  function createFolder() {
    if (!client?.models?.Folder) return console.error("No client");
    client.models.Folder.create({ name: window.prompt("Folder name") });
  }

  return (
    <View>
      <Text>My folders</Text>
      <Button title="+ new" onPress={createFolder} />
      <View>
        {folders.map((folder) => (
          <Text key={folder.id}>{folder.name}</Text>
        ))}
      </View>
      <Text>🥳 App successfully hosted. Try creating a new folder.</Text>
      <Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates"
            )
          }
        >
          Review next step of this tutorial.
        </TouchableOpacity>
      </Text>
    </View>
  );
}

export default App;

import React from "react";
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Button, Linking, Text, TouchableOpacity, View } from "react-native";

const client = generateClient<Schema>();

function App() {
  const [folders, setFolders] = useState<Array<Schema["Folder"]["type"]>>([]);

  useEffect(() => {
    client.models.Folder.observeQuery().subscribe({
      next: (data) => setFolders([...data.items]),
    });
  }, []);

  function createFolder() {
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

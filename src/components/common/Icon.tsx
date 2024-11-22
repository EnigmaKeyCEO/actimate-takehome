import { Icon as IconNative } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform } from "react-native";
import createIconSet from "@expo/vector-icons/build/createIconSet";

const Icon = (props: any) => {
  const CustomIcon = Platform.select({
    ios: (_props: any) => (
      <IconNative as={MaterialIcons} {...props} {..._props} />
    ),
    web: (_props: any) =>{
      const IconDat = createIconSet(MaterialIcons.glyphMap, "MaterialIcons", "");
      return <IconDat.Button {...props} {..._props} />;
    },
  }) as React.ElementType;

  return <CustomIcon as={MaterialIcons} {...props} />;
};
export default Icon;

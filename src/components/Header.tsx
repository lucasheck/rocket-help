import {
	HStack,
	Heading,
	IconButton,
	useTheme,
	StyledProps,
} from "native-base";
import { CaretLeft } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";

type Props = StyledProps & {
	title: string;
};

export function Header({ title, ...rest }: Props) {
	const { colors } = useTheme();
	const navigation = useNavigation();

	function handleGoBack() {
		navigation.goBack();
	}

	return (
		<HStack pt={16} pl={6} pb={6} alignItems="center">
			<IconButton
				icon={<CaretLeft size={24} color={colors.gray[200]} />}
				onPress={handleGoBack}
			/>
			<Heading
				flex={1}
				color="gray.100"
				textAlign="center"
				fontSize="lg"
				ml={-12}
			>
				{title}
			</Heading>
		</HStack>
	);
}

import {
	HStack,
	Text,
	Box,
	useTheme,
	VStack,
	Circle,
	Pressable,
	IPressableProps,
} from "native-base";
import {
	Hourglass,
	ClockAfternoon,
	CircleWavyCheck,
} from "phosphor-react-native";

export type OrderProps = {
	id: string;
	patrimony: string;
	when: string;
	status: "open" | "closed";
};

type Props = IPressableProps & {
	data: OrderProps;
};

export function Order({ data, ...rest }: Props) {
	const { colors } = useTheme();

	const statusColor =
		data.status === "open" ? colors.secondary[700] : colors.green[300];

	return (
		<Pressable {...rest}>
			<HStack
				bg="gray.600"
				mb={4}
				alignItems="center"
				justifyContent="space-between"
				rounded="sm"
				overflow="hidden"
			>
				<Box h="full" w={2} bg={statusColor} />
				<VStack flex={1} my={5} ml={5}>
					<Text color="white" fontSize="md" mb={2}>
						Patrimônio {data.patrimony}
					</Text>
					<HStack alignItems="center">
						<ClockAfternoon size={20} color={colors.gray[300]} />
						<Text color={colors.gray[300]} ml={2}>
							{data.when}
						</Text>
					</HStack>
				</VStack>
				<Circle bg="gray.500" h={12} w={12} mr={5}>
					{data.status === "open" ? (
						<Hourglass size={24} color={statusColor} />
					) : (
						<CircleWavyCheck size={24} color={statusColor} />
					)}
				</Circle>
			</HStack>
		</Pressable>
	);
}

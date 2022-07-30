import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HStack, VStack, useTheme, Text, ScrollView } from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { Header } from "../components/Header";
import {
	Hourglass,
	CircleWavyCheck,
	DesktopTower,
	ClipboardText,
} from "phosphor-react-native";
import { OrderProps } from "../components/Order";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { OrderFireStoreDTO } from "../DTOs/OrderFireStoreDTO";
import { dateFormat } from "../utils/firestoreDateFormat";
import { Loading } from "../components/Loading";
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

type RouteParams = {
	orderId: string;
};

type OrderDetails = OrderProps & {
	description: string;
	solution: string;
	closed: string;
};

export function Details() {
	const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
	const [isLoading, setIsLoading] = useState(true);
	const [solution, setSolution] = useState("");
	const navigation = useNavigation();

	const { colors } = useTheme();
	const status = "open";

	const colorType =
		status === "open" ? colors.secondary[700] : colors.green[300];

	const route = useRoute();
	const { orderId } = route.params as RouteParams;

	function handleOrderClosed() {
		if (!solution) {
			return Alert.alert(
				"Solicitação",
				"Preencha o campo solução do problema."
			);
		}

		firestore()
			.collection<OrderFireStoreDTO>("orders")
			.doc(orderId)
			.update({
				status: "closed",
				solution,
				closed_at: firestore.FieldValue.serverTimestamp(),
			})
			.then(() => {
				Alert.alert(
					"Solicitação",
					"Solicitação encerrada com sucesso."
				);
				navigation.goBack();
			})
			.catch((error) => {
				console.log(error);
				Alert.alert(
					"Solicitação",
					"Não foi possível encerrar a solicitação."
				);
			});
	}

	useEffect(() => {
		firestore()
			.collection<OrderFireStoreDTO>("orders")
			.doc(orderId)
			.get()
			.then((doc) => {
				const {
					patrimony,
					description,
					status,
					created_at,
					closed_at,
					solution,
				} = doc.data();

				const closed = closed_at ? dateFormat(closed_at) : null;

				setOrder({
					id: doc.id,
					patrimony,
					description,
					status,
					solution,
					when: dateFormat(created_at),
					closed,
				});

				setIsLoading(false);
			});
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<VStack flex={1} bg="gray.700">
			<Header title="Solicitação" />
			<HStack
				w="full"
				justifyContent="center"
				alignItems="center"
				bg="gray.500"
				py={6}
			>
				{order.status === "open" ? (
					<Hourglass color={colorType} size={22} />
				) : (
					<CircleWavyCheck color={colorType} size={22} />
				)}
				<Text
					color={colorType}
					ml={4}
					fontSize="md"
					textTransform="uppercase"
				>
					{order.status === "open" ? "em andamento" : "finalizado"}
				</Text>
			</HStack>

			<ScrollView mx={5} showsVerticalScrollIndicator={false}>
				<CardDetails
					title="equipamento"
					description={`Patrimônio ${order.patrimony}`}
					icon={DesktopTower}
				/>

				<CardDetails
					title="descrição do problema"
					description={order.description}
					icon={ClipboardText}
					footer={`Registrado em ${order.when}`}
				/>

				<CardDetails
					title="solução"
					icon={CircleWavyCheck}
					description={order.solution}
					footer={order.closed && `Encerrado em ${order.closed}`}
				>
					{order.status === "open" && (
						<Input
							placeholder="Descrição da solução"
							onChangeText={setSolution}
							textAlignVertical="top"
							multiline
							h={24}
						/>
					)}
				</CardDetails>
			</ScrollView>
			{order.status === "open" && (
				<Button
					title="Encerrar solicitação"
					onPress={handleOrderClosed}
				/>
			)}
		</VStack>
	);
}

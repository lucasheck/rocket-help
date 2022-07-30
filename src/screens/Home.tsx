import {
	VStack,
	Heading,
	Icon,
	useTheme,
	HStack,
	IconButton,
	Text,
	FlatList,
} from "native-base";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";

import { SignOut, ChatTeardropText } from "phosphor-react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

import Logo from "../assets/logo_secondary.svg";
import { Button } from "../components/Button";
import { Filter } from "../components/Filter";
import { Order, OrderProps } from "../components/Order";
import { dateFormat } from "../utils/firestoreDateFormat";
import { Loading } from "../components/Loading";

export function Home() {
	const { colors } = useTheme();
	/*prettier-ignore*/
	const [statusSelected, setStatusSelected] = useState<"open" | "closed">("open");
	const [orders, setOrders] = useState<OrderProps[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const navigation = useNavigation();

	function handleNewOrder() {
		navigation.navigate("new");
	}

	function handleOpenDetails(orderId: string) {
		navigation.navigate("details", { orderId });
	}

	function handleLogout() {
		auth()
			.signOut()
			.catch((error) => {
				console.log(error);
				return Alert.alert("Sair", "Não foi possível fazer logout.");
			});
	}

	useEffect(() => {
		setIsLoading(true);
		const subscriber = firestore()
			.collection("orders")
			.where("status", "==", statusSelected)
			.onSnapshot((snapshot) => {
				const data = snapshot.docs.map((doc) => {
					/*prettier-ignore*/
					const { patrimony, description, status, created_at } = doc.data();

					return {
						id: doc.id,
						patrimony,
						description,
						status,
						when: dateFormat(created_at),
					};
				});
				setOrders(data);
				setIsLoading(false);
			});

		return subscriber;
	}, [statusSelected]);

	return (
		<VStack flex={1} bg="gray.600">
			{/* CABEÇALHO LOGO + SIGNOUT  */}
			<HStack
				w="full"
				justifyContent="space-between"
				alignItems="center"
				pt={12}
				pb={6}
				pl={6}
				pr={6}
			>
				<Logo />
				<IconButton
					icon={<SignOut size={26} color={colors.gray[300]} />}
					onPress={handleLogout}
				/>
			</HStack>

			{/* CORPO */}
			<VStack flex={1} pb={6} pt={6} bg="gray.700">
				{/* SOLICITAÇÕES - QTDE */}
				<HStack
					w="full"
					justifyContent="space-between"
					alignItems="center"
					pl={6}
					pr={6}
					pb={6}
				>
					<Heading color="white" fontSize={18}>
						Solicitações
					</Heading>
					<Text color="gray.200">{orders.length}</Text>
				</HStack>

				{/* BOTÕES */}
				<HStack w="full" space={3} pl={6} pr={6} pb={6}>
					<Filter
						type="open"
						title="EM ANDAMENTO"
						onPress={() => setStatusSelected("open")}
						isActive={statusSelected === "open"}
					></Filter>
					<Filter
						type="closed"
						title="FINALIZADOS"
						onPress={() => setStatusSelected("closed")}
						isActive={statusSelected == "closed"}
					></Filter>
				</HStack>

				{isLoading ? (
					<Loading />
				) : (
					<FlatList
						showsVerticalScrollIndicator={false}
						px={5}
						data={orders}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<Order
								data={item}
								onPress={() => handleOpenDetails(item.id)}
							/>
						)}
						ListEmptyComponent={() => (
							<VStack flex={1} alignItems="center" pt={10}>
								<ChatTeardropText
									color={colors.gray[300]}
									size={50}
								/>
								<Text
									color="gray.300"
									fontSize={24}
									pt={6}
									textAlign="center"
								>
									Você ainda não tem {"\n"} solicitações
									{statusSelected === "open"
										? " em andamento"
										: " finalizadas"}
								</Text>
							</VStack>
						)}
					></FlatList>
				)}
			</VStack>

			{/* RODAPÉ */}
			<Button
				title="Nova Solicitação"
				w="xl"
				alignSelf="center"
				bg="green.700"
				margin={6}
				onPress={handleNewOrder}
			/>
		</VStack>
	);
}

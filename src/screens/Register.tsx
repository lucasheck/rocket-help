import { VStack, useTheme } from "native-base";
import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Header } from "../components/Header";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export function Register() {
	const { colors } = useTheme();

	const [isLoading, setIsLoading] = useState(false);
	const [patrimony, setPatrimony] = useState("");
	const [description, setDescription] = useState("");
	const navigation = useNavigation();

	function handleNewOrderRegister() {
		if (!patrimony || !description) {
			return Alert.alert(
				"Solicitação",
				"Patrimônio e Descrição são necessários."
			);
		}

		setIsLoading(true);

		firestore()
			.collection("orders")
			.add({
				patrimony,
				description,
				status: "open",
				created_at: firestore.FieldValue.serverTimestamp(),
			})
			.then(() => {
				Alert.alert(
					"Solicitação",
					"Solicitação registrada com sucesso."
				);
				navigation.goBack();
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
				return Alert.alert(
					"Solicitação",
					"Não foi possível registrar a solicitação."
				);
			});
	}

	return (
		<VStack flex={1} bg="gray.600">
			<Header title="Nova Solicitação" />
			<Input
				placeholder="Número do Patrimônio"
				mx={6}
				mb={4}
				onChangeText={setPatrimony}
			/>
			<Input
				placeholder="Descrição do problema"
				flex={1}
				mx={6}
				mb={10}
				pt={6}
				textAlignVertical="top"
				onChangeText={setDescription}
			/>

			<Button
				title="Cadastrar"
				mb={10}
				mx={6}
				isLoading={isLoading}
				onPress={handleNewOrderRegister}
			/>
		</VStack>
	);
}

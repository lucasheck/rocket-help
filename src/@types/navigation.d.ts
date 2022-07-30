declare global {
	namespace ReactNavigation {
		interface RootParamList {
			home: undefined;
			new: undefined;
			details: { orderId: string };
		}
	}
}
export default global;

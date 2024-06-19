import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#00c012' }}
        contentContainerStyle={{ paddingHorizontal: 15, backgroundColor: '#00c012' }}
        text1Style={{
          fontSize: 18,
          fontWeight: '400',
          color: '#fff',
          zIndex: 999,
          position: 'absolute',
          top: 1,
          left: 1
        }}
      />
    ),
   
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: '#FF0000' }}
        contentContainerStyle={{ paddingHorizontal: 15, backgroundColor: '#FF0000' }}
        text1Style={{
          fontSize: 18,
          fontWeight: '400',
          color: '#ffffff',
          zIndex: 999
        }}
      />
    ),
};

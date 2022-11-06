import { Center, Icon, Text } from 'native-base'
import { AntDesign } from '@expo/vector-icons'

import { useAuth } from '../hooks/useAuth'

import { Button } from '../components/Button'

import Logo from '../assets/logo.svg'

export function SignIn() {
  const { signIn, user } = useAuth()

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />
      <Button
        title="ENTRAR NO GOOGLE"
        leftIcon={<Icon as={AntDesign} name="google" color="white" size="md" />}
        type="secondary"
        mt={12}
        onPress={signIn}
      />
      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação do Google,{'\n'} apenas para autenticação.
      </Text>
    </Center>
  )
}
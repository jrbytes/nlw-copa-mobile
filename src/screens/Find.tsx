import { useState } from "react"
import { Heading, useToast, VStack } from "native-base"
import { useNavigation } from "@react-navigation/native"

import { api } from "../services/api"

import { Header } from "../components/Header"
import { Input } from "../components/Input"
import { Button } from "../components/Button"

export function Find() {
  const [isLoadingPool, setIsLoadingPool] = useState(false)
  const [code, setCode] = useState('')

  const toast = useToast()
  const { navigate } = useNavigation()
  
  async function handleJoinPool() {
    try {
      setIsLoadingPool(true)
      
      const codeTrimmed = code.trim()
      if (!codeTrimmed) {
        return toast.show({
          title: "Error!",
          description: "Informe o código.",
          placement: "top",
          bgColor: "red.500",
        })
      }
      
      await api.post('/pools/join', { code: codeTrimmed })

      toast.show({
        title: "Sucesso!",
        description: "Você entrou no bolão.",
        placement: "top",
        bgColor: "green.500",
      })

      navigate('pools')
    } catch (error) {
      console.log(error)
      setIsLoadingPool(false)

      if (error.response?.data?.message === 'Pool not found') {
        return toast.show({
          title: "Error!",
          description: "Bolão não encontrado.",
          placement: "top",
          bgColor: "red.500",
        })
      }

      if (error.response?.data?.message === 'Already joined') {
        return toast.show({
          title: "Error!",
          description: "Você já está nesse bolão.",
          placement: "top",
          bgColor: "red.500",
        })
      }

      toast.show({
        title: "Error!",
        description: "Não foi possível encontrar o bolão.",
        placement: "top",
        bgColor: "red.500",
      })
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoadingPool}
          onPress={handleJoinPool}
        />
      </VStack>

    </VStack>
  )
}
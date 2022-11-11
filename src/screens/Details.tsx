import { useEffect, useState } from 'react'
import { HStack, useToast, VStack } from 'native-base'
import { useRoute } from '@react-navigation/native'

import { api } from '../services/api'

import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { PoolCardProps } from '../components/PoolCard'
import { PoolHeader } from '../components/PoolHeader'
import { EmptyMyPoolList } from '../components/EmptyMyPoolList'
import { Option } from '../components/Option'
import { Share } from 'react-native'
import { Guesses } from '../components/Guesses'

type RouteParams = {
  id: string
}

export function Details() {
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses')
  const [isLoadingPoolDetails, setIsLoadingPoolDetails] = useState(true)
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>()

  const route = useRoute()
  const toast = useToast()

  const { id } = route.params as RouteParams

  async function fetchPoolDetails() {
    try {
      setIsLoadingPoolDetails(true)

      const { data } = await api.get(`/pools/${id}`)
      setPoolDetails(data.pool)
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Erro!',
        description: 'Não foi possível carregar os detalhes do bolão.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoadingPoolDetails(false)
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code
    })
  }

  useEffect(() => {
    fetchPoolDetails()
  }, [id])

  if (isLoadingPoolDetails) {
    return <Loading />
  }

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>
          <Guesses poolId={poolDetails.id} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  )
}
import { useEffect, useState } from 'react'
import { useToast, FlatList } from 'native-base'

import { api } from '../services/api'

import { Game, GameProps } from '../components/Game'
import { Loading } from '../components/Loading'

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const [isLoadingGuesses, setIsLoadingGuesses] = useState(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')

  const toast = useToast()

  async function fetchGames() {
    try {
      setIsLoadingGuesses(true)

      const { data } = await api.get(`/pools/${poolId}/games`)
      setGames(data.games)
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Erro!',
        description: 'Não foi possível carregar os jogos.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoadingGuesses(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {

    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Erro!',
          description: 'Informe o placar do palpite.',
          placement: 'top',
          bgColor: 'red.500',
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })

      toast.show({
        title: 'Sucesso!',
        description: 'Palpite realizado com sucesso.',
        placement: 'top',
        bgColor: 'green.500',
      })

      fetchGames()
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Erro!',
        description: 'Não foi possível enviar o palpite.',
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  useEffect(() => {
    fetchGames()
  }, [poolId])

  if (isLoadingGuesses) {
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game                                                                                              
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
    />
  );
}

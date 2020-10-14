import React, { useState, useEffect, useCallback } from 'react';
import { client } from './utils/API';
import { useComponentDidMount } from './hooks/useComponentDidMount';
import { Flex, Box, Image } from '@chakra-ui/core';

function App() {
  function* gen(arr) {
    yield* arr;
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const [gifs, setGifs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [genned, setGenned] = useState(null);

  const isMounted = useComponentDidMount();

  useEffect(() => {
    async function getTrending() {
      try {
        const { data } = await client(
          `trending?api_key=${process.env.REACT_APP_API_KEY}`
        );

        setGifs(data);
        setGenned(gen(data));
        console.log(genned);
      } catch (err) {
        console.log(err);
      }
    }

    getTrending();
  }, []);

  useEffect(() => {
    async function stepThrough() {
      await delay(3000);

      const next = genned.next().value;

      console.log(next);

      if (next) {
        setSelected(next);
        console.log(selected);
      } else {
        setSelected('The End');
      }
    }

    if (isMounted) {
      stepThrough();
    }
  }, [selected, genned]);

  return (
    <main>
      <Flex height="100vh" align="center" justify="center">
        {selected ? (
          <Box bg="tomato" w="50%" p={4} color="white">
            <Flex justify="center">
              <Image src={selected.images.fixed_height.url} />
            </Flex>
          </Box>
        ) : (
          <h2>Hi!</h2>
        )}
      </Flex>
    </main>
  );
}

export default App;

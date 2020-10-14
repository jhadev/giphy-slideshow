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
          `trending?limit=10&api_key=${process.env.REACT_APP_API_KEY}`
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
        setSelected(gifs);
      }
    }

    if (isMounted) {
      stepThrough();
    }
  }, [selected, genned]);

  function isArray(prop) {
    return prop instanceof Array;
  }

  return (
    <main className="container">
      <Flex
        h={isArray(selected) ? '100%' : '100vh'}
        align="center"
        justify="center">
        {selected && !isArray(selected) ? (
          <Box
            bg="tomato"
            w={`${selected.images.fixed_height.width}px`}
            p={4}
            color="white">
            <Flex justify="center">
              <Image src={selected.images.fixed_height.url} />
            </Flex>
          </Box>
        ) : selected && isArray(selected) ? (
          <Flex direction="row" wrap="wrap" justify="space-between">
            {selected.map((gif) => {
              return (
                <Box
                  key={gif.id}
                  bg="tomato"
                  w={`${gif.images.fixed_height.width}px`}
                  p={4}
                  m={2}
                  color="white">
                  <Flex justify="center">
                    <Image src={gif.images.fixed_height.url} />
                  </Flex>
                </Box>
              );
            })}
          </Flex>
        ) : (
          <h2>Hi!</h2>
        )}
      </Flex>
    </main>
  );
}

export default App;

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { CSSReset, Flex, Stack } from '@chakra-ui/core';
import { client } from './utils/API';
import { gen, delay, isArray, resize } from './utils/helpers';
import { useComponentDidMount } from './hooks/useComponentDidMount';
import ColorMode from './components/ColorMode';
import ImageLayout from './components/ImageLayout';
import ImageContainer from './components/ImageContainer';
import Start from './components/Start';

function App() {
  const [gifs, setGifs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [genned, setGenned] = useState(null);
  const [paused, setPaused] = useState(true);

  const isMounted = useComponentDidMount();

  const getTrending = useCallback(
    async (params) => {
      try {
        const { data } = await client(params);

        const withRank = data
          .map((gifData, index) => {
            return { ...gifData, rank: index + 1 };
          })
          .reverse();

        console.log(withRank);
        setGifs(withRank);
        setGenned(gen(withRank));
      } catch (err) {
        console.log(err);
      }
    },
    [genned]
  );

  useEffect(() => {
    getTrending(`trending?limit=10&api_key=${process.env.REACT_APP_API_KEY}`);
  }, []);

  useEffect(() => {
    const { promise, timeOutId } = delay(3000);
    function stepThrough() {
      const next = genned.next().value;

      console.log(next);

      if (next) {
        setSelected(next);
      } else {
        setSelected(gifs);
      }
    }

    async function run() {
      if (isMounted && !paused) {
        await promise;
        stepThrough();
      } else {
        clearTimeout(timeOutId - 1);
      }
    }

    run();
  }, [selected, paused, genned]);

  return (
    <ColorMode>
      <CSSReset />
      <main className="container">
        <Flex
          h={isArray(selected) ? '100%' : '100vh'}
          align="center"
          justify="center">
          {selected && !isArray(selected) ? (
            <Stack spacing={4}>
              <ImageLayout
                selected={selected}
                paused={paused}
                setPaused={setPaused}
                resize={resize}
              />
            </Stack>
          ) : selected && isArray(selected) ? (
            <Flex m={2} direction="row" wrap="wrap" justify="center">
              {selected.map((gif) => {
                return (
                  <Fragment key={gif.id}>
                    <ImageContainer gif={gif} resize={resize} />
                  </Fragment>
                );
              })}
            </Flex>
          ) : (
            <Stack spacing={10}>
              <Start paused={paused} setPaused={setPaused} />
            </Stack>
          )}
        </Flex>
      </main>
    </ColorMode>
  );
}

export default App;

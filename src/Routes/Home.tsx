import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useViewportScroll, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult, getTopRatedMovies, IGetTopRatedMoviesResult, getUpComingMovies } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow-x : hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 96%;
  margin : auto 2%;
`;

const Box = styled(motion.div) <{ bgphoto: string }>`
background-color: white;
background-image: url(${(props) => props.bgphoto});
background-size: cover;
background-position: center center;
height: 200px;
font-size: 66px;
&:first-child {
  transform-origin: center left;
}
&:last-child {
  transform-origin: center right;
}
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left : 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index:100;
  overflow : hidden;
`;

const BigMovie = styled(motion.div)`
position: fixed;
width: 40vw;
height: 80vh;
top : 11vh;
left: 0;
right: 0;
margin: 0 auto;
border-radius: 15px;
overflow: hidden;
background-color: ${(props) => props.theme.black.lighter};
z-index:100;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 500px;
`;



const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -85px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -430px;
  color: ${(props) => props.theme.white.lighter};
  width: 64%;
  float: right;
`;

const BigPoster = styled.div`
  background-size: cover;
  background-position: center center;
  height: 490px;
  width: 310px;
  margin-left: 30px;
  position: relative;
    top: -60px;
`;

const BigDate = styled.p`
  padding: 5px 20px;
  position: relative;
  top: -430px;
  color: ${(props) => props.theme.white.lighter};
  width: 64%;
  float: right;
`;

const BigPopular = styled.p`
  padding: 5px 20px;
  position: relative;
  top: -430px;
  color: ${(props) => props.theme.white.lighter};
  width: 64%;
  float: right;
`;

const SliderDiv = styled.div`
position: relative;
min-height: 20rem;
`;

const SliderTitle = styled.h1`
  font-size: 30px;
  padding : 10px;
  position : absolute;
  top : -60px;
  left : 40px;
`;

const SliderLeftBtn = styled(motion.span)`
position: absolute;
left: 20px;
top: 80px;
content: '';
width: 30px;
height: 30px;
border-top: 5px solid #ffffff;
border-right: 5px solid #ffffff;
transform: rotate(225deg);
z-index:90;
`;

const SliderRightBtn = styled(motion.span)`
position: absolute;
right: 20px;
top: 80px;
content: '';
width: 30px;
height: 30px;
border-top: 5px solid #ffffff;
border-right: 5px solid #ffffff;
transform: rotate(45deg);
z-index:90;
`;

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

const useMultipleQuery = () => {
  const now = useQuery<IGetMoviesResult>(["now"], getMovies);
  const topRated = useQuery(["top"], getTopRatedMovies);
  const upComing = useQuery(["upComing"], getUpComingMovies);

  return [now, topRated, upComing];
}



function Home() {
  const navigate = useNavigate();
  //const bigMovieMatch = useMatch("/movies/:movieId");
  const nowPlaying = useMatch("/movies/nowPlaying/:movieId");
  const topRated = useMatch("/movies/topRated/:movieId");
  const upcoming = useMatch("/movies/upcoming/:movieId");

  const { scrollY } = useScroll();
  // const { data, isLoading } = useQuery<IGetMoviesResult>(
  //   ["movies", "nowPlaying"],
  //   getMovies
  // );

  const [{ isLoading: loadingNow, data: nowData },
    { isLoading: loadingTop, data: topData },
    { isLoading: loadingUpcoming, data: upComingData }] = useMultipleQuery();

  const [indexNow, setIndexNow] = useState(0);
  const [indexTop, setIndexTop] = useState(0);
  const [indexUpcoming, setIndexUpcoming] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false);

  const incraseIndex = (category: string, inde: string) => {
    setIsBack(false);
    let data;
    let set = setIndexNow;
    if (category === "now") {
      data = nowData;
      set = setIndexNow;
    } else if (category === "top") {
      data = topData;
      set = setIndexTop;
    } else if (category === "upcoming") {
      data = upComingData;
      set = setIndexUpcoming;
    }

    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      set((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decraseIndex = (category: string, inde: string) => {
    setIsBack(true);
    let data;
    let set = setIndexNow;
    if (category === "now") {
      data = nowData;
      set = setIndexNow;
    } else if (category === "top") {
      data = topData;
      set = setIndexTop;
    } else if (category === "upcoming") {
      data = upComingData;
      set = setIndexUpcoming;
    }

    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      //set((prev) => (prev === maxIndex ? 0 : prev + 1));
      set((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };



  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number, clickedCategory: string) => {
    //navigate(`/movies/${movieId}`);
    navigate(`/movies/${clickedCategory}/${movieId}`);
  };
  const onOverlayClick = () => navigate("/");
  const nowClickedMovie =
    nowPlaying?.params.movieId &&
    nowData?.results.find((movie: any) => movie.id + "" === nowPlaying.params.movieId);
  const topClickedMovie =
    topRated?.params.movieId &&
    topData?.results.find((movie: any) => movie.id + "" === topRated.params.movieId);
  const upcomingClickedMovie =
    upcoming?.params.movieId &&
    upComingData?.results.find((movie: any) => movie.id + "" === upcoming.params.movieId);

  return (
    <Wrapper>
      {loadingNow || loadingTop || loadingUpcoming ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(nowData?.results[0].backdrop_path || "")}
          >
            <Title>{nowData?.results[0].title}</Title>
            <Overview>{nowData?.results[0].overview}</Overview>
          </Banner>

          <SliderDiv>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={isBack}>
                <SliderLeftBtn onClick={() => decraseIndex("now", "decrease")} />
                <SliderRightBtn onClick={() => incraseIndex("now", "increase")} />
                <SliderTitle>Now Playing</SliderTitle>
                <Row
                  custom={isBack}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={indexNow}

                >
                  {nowData?.results
                    .slice(1)
                    .slice(offset * indexNow, offset * indexNow + offset)
                    .map((movie: any) => (
                      <Box
                        layoutId={movie.id + "now"}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onBoxClicked(movie.id, "nowPlaying")}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {nowPlaying ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <BigMovie
                    layoutId={nowPlaying.params.movieId + "now"}
                  >
                    {nowClickedMovie && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              nowClickedMovie.backdrop_path
                            )})`,
                          }}
                        />
                        <BigTitle>{nowClickedMovie.title}</BigTitle>
                        <BigPoster style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              nowClickedMovie.poster_path
                            )})`,
                          }}/>
                        <BigOverview>{nowClickedMovie.overview}</BigOverview>
                        <BigDate>{nowClickedMovie.release_date ? "출시일 : "+ nowClickedMovie.release_date : null }</BigDate>
                        <BigPopular>{nowClickedMovie.popularity ? "인기점수 : "+nowClickedMovie.popularity : null}</BigPopular>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>
          </SliderDiv>


          <SliderDiv>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={isBack}>
                <SliderLeftBtn onClick={() => decraseIndex("top", "decrease")} />
                <SliderRightBtn onClick={() => incraseIndex("top", "increase")} />
                <SliderTitle>Top Rated</SliderTitle>
                <Row
                  custom={isBack}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={indexTop}
                >
                  {topData?.results
                    .slice(0)
                    .slice(offset * indexTop, offset * indexTop + offset)
                    .map((movie: any) => (
                      <Box
                        layoutId={movie.id + "top"}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onBoxClicked(movie.id, "topRated")}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {topRated ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <BigMovie
                    layoutId={topRated.params.movieId + "top"}
                  >
                    {topClickedMovie && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              topClickedMovie.backdrop_path
                            )})`,
                          }}
                        />
                        <BigTitle>{topClickedMovie.title}</BigTitle>
                        <BigPoster style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              topClickedMovie.poster_path
                            )})`,
                          }}/>
                        <BigOverview>{topClickedMovie.overview}</BigOverview>
                        <BigDate>{topClickedMovie.release_date ? "출시일 : "+ topClickedMovie.release_date : null }</BigDate>
                        <BigPopular>{topClickedMovie.popularity ? "인기점수 : "+topClickedMovie.popularity : null}</BigPopular>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>
          </SliderDiv>

          <SliderDiv>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={isBack}>
                <SliderLeftBtn onClick={() => decraseIndex("upcoming", "decrease")} />
                <SliderRightBtn onClick={() => incraseIndex("upcoming", "increase")} />
                <SliderTitle>UpComing</SliderTitle>
                <Row
                  custom={isBack}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={indexUpcoming}
                >
                  {upComingData?.results
                    .slice(0)
                    .slice(offset * indexUpcoming, offset * indexUpcoming + offset)
                    .map((movie: any) => (
                      <Box
                        layoutId={movie.id + "upComing"}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onBoxClicked(movie.id, "upcoming")}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {upcoming ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <BigMovie
                    layoutId={upcoming.params.movieId + "upComing"}
                  >
                    {upcomingClickedMovie && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              upcomingClickedMovie.backdrop_path
                            )})`,
                          }}
                        />
                        <BigTitle>{upcomingClickedMovie.title}</BigTitle>
                        <BigPoster style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              upcomingClickedMovie.poster_path
                            )})`,
                          }}/>
                        <BigOverview>{upcomingClickedMovie.overview}</BigOverview>
                        <BigDate>{upcomingClickedMovie.release_date ? "출시일 : "+ upcomingClickedMovie.release_date : null }</BigDate>
                        <BigPopular>{upcomingClickedMovie.popularity ? "인기점수 : "+upcomingClickedMovie.popularity : null}</BigPopular>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>
          </SliderDiv>




        </>
      )}
    </Wrapper>
  );
}
export default Home;
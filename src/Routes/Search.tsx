import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSearch } from "../api";
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
overflow: auto;
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
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
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

let offset: number = 6;

function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data, isLoading } = useQuery(["search"], () => getSearch(keyword));
    const search = useMatch("/search/:movieId");
    const { scrollY } = useScroll();
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const [isBack, setIsBack] = useState(false);

    const incraseIndex = (category: string) => {
        setIsBack(false);

        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length;
            if (totalMovies < 6) {
                offset = 0
            }
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const decraseIndex = (category: string) => {
        setIsBack(true);

        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            //set((prev) => (prev === maxIndex ? 0 : prev + 1));
            setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
        }
    };

    const toggleLeaving = () => setLeaving((prev) => !prev);

    const onBoxClicked = (movieId: number, clickedCategory: string) => {
        navigate(`/search/${movieId}`);
    };
    const onOverlayClick = () => navigate("/search");
    const nowClickedSearch =
        search?.params.movieId &&
        data?.results.find((movie: any) => movie.id + "" === search.params.movieId);


    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>

                    <SliderDiv>
                        <Slider>
                            <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={isBack}>
                                <SliderLeftBtn onClick={() => decraseIndex("now")} />
                                <SliderRightBtn onClick={() => incraseIndex("now")} />
                                <SliderTitle>"{keyword}"로 검색한 결과입니다</SliderTitle>
                                <Row
                                    custom={isBack}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 1 }}
                                    key={index}

                                >
                                    {data?.results
                                        .slice(1)
                                        .slice(offset * index, offset * index + offset)
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
                            {search ? (
                                <>
                                    <Overlay
                                        onClick={onOverlayClick}
                                        exit={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    />
                                    <BigMovie
                                        layoutId={search.params.movieId + "now"}
                                    >
                                        {nowClickedSearch && (
                                            <>
                                                <BigCover
                                                    style={{
                                                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                            nowClickedSearch.backdrop_path
                                                        )})`,
                                                    }}
                                                />
                                                <BigTitle>{nowClickedSearch.title ? nowClickedSearch.title : "제목이 제공되지 않습니다."}</BigTitle>
                                                <BigOverview>{nowClickedSearch.overview}</BigOverview>
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
export default Search;
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from 'next/error'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ArtworkCard from "../../components/ArtworkCard";
import { Pagination } from "react-bootstrap";
import validObjectIDList from '../../public/data/validObjectIDList.json'


const PER_PAGE = 12;
const Artwork = () =>{
    let [page, setPage] = useState(1);
    const [artworkList, setArtworkList] = useState();

    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];

    const fetcher = (...args) => fetch(...args).then((res) => res.json()); 

    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`, fetcher);

    const previousPage = () =>{
        if(page > 1){
            setPage(--page);
        }
    }

    const nextPage = () =>{
        if(page < artworkList?.length){
            setPage(++page);
            window.scrollTo({top: 0});   
        }
    }

    useEffect(() => {
        if(data != null){
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            let results = [];
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }            
              setArtworkList(results);
              setPage(1);     
        }
      }, [data]);

      if(error){
        return <Error statusCode={404} /> 
      }

    return (
       
        <>
        {artworkList ? <Row className="gy-4">
            {artworkList.length > 0 && artworkList[page - 1]?.length > 0 ?  artworkList[page -1].map(art =>(
                    
                    <Col lg={3} key={art}><ArtworkCard objectID={art} /></Col>
                    
                )) : <h4>Nothing Here Try searching for something else</h4>}
        </Row>: null} <br />
        {artworkList?.length > 0 ?    <Pagination>
        <Pagination.Prev onClick={(event, page) => previousPage()}/>
        <Pagination.Item>{page}</Pagination.Item>
        <Pagination.Next onClick={(event, page) => nextPage()}/>
        </Pagination> : null}
        </>
       
    )
}

export default Artwork;
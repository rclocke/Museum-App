import { useAtom } from 'jotai';
import { favouritesAtom } from "../store";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ArtworkCard from "../components/ArtworkCard";
import { useState, useEffect } from "react";

const Favourites = () =>{
    const [artworkList, setArtworkList] = useState();
    let [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    if(!favouritesList) return null;   
    return(
        <>
          {favouritesList ? <Row className="gy-4">
            {favouritesList.length > 0  ?  favouritesList.map(art =>(
                    
                    <Col lg={3} key={art}><ArtworkCard objectID={art} /></Col>
                    
                )) : <h4>Nothing Here Try searching for something else</h4>}
        </Row>: null}
        </>
    )
}

export default Favourites;
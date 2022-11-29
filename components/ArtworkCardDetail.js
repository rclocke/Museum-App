import React from "react";
import useSWR from 'swr';
import Error from 'next/error'
import { Card } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { favouritesAtom } from "../store";
import { useState, useEffect } from 'react';
import {Button} from 'react-bootstrap';
import { addToFavourites, removeFromFavourites } from "../lib/userData";  

const ArtworkCardDetail = (props) =>{

    let objectID = props.objectID
    let [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    let[showAdded, setShowAdded] = useState(false);

    useEffect(()=>{
        setShowAdded(favouritesList?.includes(objectID))
    }, [favouritesList])
    
    async function favouritesClicked(){
        
        if(showAdded){
            setFavouritesList(await removeFromFavourites(objectID));
            setShowAdded(false);
        }
        else{
            setFavouritesList(await addToFavourites(objectID));
            setShowAdded(true);
        }
    }

    const fetcher = (...args) => fetch(...args).then((res) => res.json()); 

    const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);

    let element = null;

    if(data?.primaryImage){
        element = data?.primaryImage
    }
    else{
        element = ""
    }

    return(
        <>
        {data?.objectID ? <Card >
            <Card.Img variant="top" src={element} />
            <Card.Body>
                <Card.Title>{data?.title ? data?.title : 'N/A'}</Card.Title>
                <Card.Text>
                <strong>Date:</strong> {data?.objectDate ? data?.objectDate : 'N/A'}<br />
                <strong>Classification:</strong> {data?.classification ? data?.classification : 'N/A'}<br />
                <strong>Medium:</strong> {data?.medium ? data?.medium : 'N/A'}<br /><br />
                <strong>Artist:</strong> {data?.artistDisplayName ? data?.artistDisplayName : 'N/A'} {" "}
                ( {data?.artistDisplayName ? <a href={data?.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a> : ""} )<br />
                <strong>Credit Line:</strong> {data?.creditLine ? data?.creditLine : 'N/A'}<br />
                <strong>Dimensions:</strong> {data?.dimensions ? data?.dimensions : 'N/A'}<br /> <br />
                <Button variant={showAdded ? 'primary' : 'outline-primary'}  onClick={favouritesClicked}>{showAdded ? "+ Favourite (added)" : "+ Favourite" }</Button>
                </Card.Text>
            </Card.Body>
        </Card>  : <Error statusCode={404} />}
        </>
    )
}

export default ArtworkCardDetail;
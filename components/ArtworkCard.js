import React from "react";
import useSWR from 'swr';
import Error from 'next/error'
import Link from 'next/link'
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const ArtworkCard = (props) =>{
    let objectID = props.objectID
    const fetcher = (...args) => fetch(...args).then((res) => res.json()); 

    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`, fetcher);

    let element = null;
    if(data?.primaryImageSmall){
        element = data?.primaryImageSmall
    }
    else{
        element = "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"
    }
   
    return(
        <>
        {data?.objectID ? <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={element} />
            <Card.Body>
                <Card.Title>{data?.title ? data?.title : 'N/A'}</Card.Title>
                <Card.Text>
                <strong>Date: </strong>{data?.objectDate ? data?.objectDate : 'N/A'}<br />
                <strong>Classification: </strong>{data?.classification ? data?.classification : 'N/A'}<br />
                <strong>Medium: </strong>{data?.medium ? data?.medium : 'N/A'}<br />
                </Card.Text>
                <Link href= {`/artwork/${data?.objectID}`} passHref>
                <Button variant="outline-primary"><strong>ID: </strong>{data?.objectID}</Button>
                </Link>
            </Card.Body>
        </Card>  : <Error statusCode={404} />}
        </>
    )
}

export default ArtworkCard;

import React, {useEffect, useState, useContext} from "react";
import { useHttpClient } from '../../shared/hooks/http-hooks';

import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const auth = useContext(AuthContext)
    
    const userId = useParams().userId;
    console.log(userId)

    useEffect( () => {
        const fetchedPlaces = async () => {
          try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
            setLoadedPlaces(responseData.places)
            
          }  catch (err) {}
            
        }
        fetchedPlaces();
    }, [sendRequest, userId]);
    
    const placeDeleteHandler = (deletePlaceId) => {
        setLoadedPlaces(prevPlaces =>  
            prevPlaces.filter(place => place.id!== deletePlaceId)  
        );
    };
    
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <LoadingSpinner asOverlay /> }
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />}
      </React.Fragment>
    )}
 
export default UserPlaces;
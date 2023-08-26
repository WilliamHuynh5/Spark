import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Event } from '../api/utils/interfaces';
import HomeHeader from '../components/Common/HomeHeader';
import BannerWithTitleAndAvatar from '../components/Common/BannerWithTitleAndAvatar';
import { eventBanner, profilePicture } from '../components/Common/Pictures';
import SocietyUpper from '../components/SocietyView/SocietyUpper';
import SocietyLower from '../components/SocietyView/SocietyLower';
import { Society } from '../api/utils/interfaces';

/**
 * SocietyViewPage component displays the details of a specific society.
 * It fetches and displays the society information, society events, and provides a navigation option for society management.
 *
 * @returns {JSX.Element} - The JSX element representing the SocietyViewPage component.
 */
const SocietyViewPage = () => {
  // State to store the current society details
  const [curSoc, setCurSoc] = useState<Society>({
    societyId: -1,
    societyName: '',
    description: '',
    photoURL: '',
  });

  // State to store the society events
  const [societyPosts, setSocietyPosts] = useState<Event[]>([]);

  // Hook to navigate to a different route
  const navigate = useNavigate();

  // TODO: FIX THIS DISGUSTING CODE
  // Extract the 'societyId' from URL parameters using useParams hook from react-router-dom,
  // and convert it into a number using `parseInt`.
  const params = useParams<{ societyId?: string }>();
  const societyIdStr = params.societyId;
  if (!societyIdStr) {
    navigate('/auth/login');
  }
  const societyId = parseInt(societyIdStr as string);

  // useEffect hook to load the society details and events when the component mounts
  useEffect(() => {
    const loadSociety = async () => {
      try {
        // Get the society details
        const tempSoc = await api.society.view(societyId);
        const societyData: Society = {
          societyId: tempSoc.societyId,
          societyName: tempSoc.societyName,
          description: tempSoc.description,
          photoURL: tempSoc.photoURL,
        };
        setCurSoc(societyData);

        // Get the society events
        const tempPosts = await api.society.events(societyId);
        setSocietyPosts(tempPosts.events);
      } catch (err: unknown) {
        console.error(err);
        navigate('/home');
      }
    };
    loadSociety();
  }, [societyId, navigate]);

  return (
    <React.Fragment>
      <HomeHeader />
      {/* Display the banner with society title and avatar */}
      <BannerWithTitleAndAvatar
        backgroundImageSrc={eventBanner}
        avatarSrc={profilePicture}
        title={curSoc.societyName}
      />
      {/* Display the upper part of the society view */}
      <SocietyUpper societyId={societyId}></SocietyUpper>
      {/* Display the lower part of the society view */}
      <SocietyLower curSoc={curSoc} societyPosts={societyPosts}></SocietyLower>
    </React.Fragment>
  );
};

export default SocietyViewPage;

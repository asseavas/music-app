import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectOneAlbum, selectOneAlbumFetching } from './albumsSlice';
import { fetchOneAlbum } from './albumsThunks';
import imageNotFound from '../../assets/images/no-image.jpg';
import {
  Avatar,
  Box,
  CircularProgress,
  Grid2,
  IconButton,
  Typography,
} from '@mui/material';
import AlbumTrackItem from '../tracks/components/TrackItem';
import {
  AlbumImageContainer,
  AlbumTracksInfoContainer,
  API_URL,
  ContentContainer,
  OneAlbumCardMedia,
} from '../../constants';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { selectUser } from '../users/usersSlice';
import { addToHistory } from '../trackHistory/tracksHistoryThunks';
import { selectHistoryTracksCreating } from '../trackHistory/tracksHistorySlice';
import {
  selectTrackDeleting,
  selectTrackPublication,
} from '../tracks/tracksSlice';
import { toast } from 'react-toastify';
import { deleteTrack, publishTrack } from '../tracks/tracksThunks';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const OneAlbum = () => {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const album = useAppSelector(selectOneAlbum);
  const isFetching = useAppSelector(selectOneAlbumFetching);
  const isDeleting = useAppSelector(selectTrackDeleting);
  const isPublication = useAppSelector(selectTrackPublication);
  const user = useAppSelector(selectUser);
  const isCreating = useAppSelector(selectHistoryTracksCreating);
  const artistAvatarImage = `${API_URL}/${album?.artist.image}`;
  let albumImage = imageNotFound;

  if (album?.image) {
    albumImage = `${API_URL}/${album.image}`;
  }

  const handleDeleteTrack = async (trackId: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this track?')) {
        await dispatch(deleteTrack(trackId)).unwrap();
        await dispatch(fetchOneAlbum(id));
        toast.success('The track has been deleted!');
      }
    } catch (error) {
      toast.error('The track has not been deleted!');
    }
  };

  const handlePublishTrack = async (trackId: string) => {
    try {
      if (window.confirm('Are you sure you want to publish this track?')) {
        await dispatch(publishTrack(trackId)).unwrap();
        await dispatch(fetchOneAlbum(id));
        toast.success('The track has been published!');
      }
    } catch (error) {
      toast.error('The track has not been published!');
    }
  };

  let content: React.ReactNode = (
    <Grid2 container mt={5} mb={5}>
      <Grid2 component={Typography} variant="body2" color="text.secondary">
        There are no songs here!
      </Grid2>
    </Grid2>
  );

  if (isFetching) {
    content = <CircularProgress />;
  } else if (album && album.tracks.length > 0) {
    const visibleTracks = album.tracks.filter((track) => {
      return (
        track.isPublished ||
        (user && track.user === user._id) ||
        (user && user.role === 'admin')
      );
    });

    if (visibleTracks.length > 0) {
      content = visibleTracks.map((track) => (
        <AlbumTrackItem
          key={track._id}
          track={track}
          user={user}
          onClick={() => addTrackToHistory(track._id)}
          addToHistoryLoading={isCreating}
          isDeleting={isDeleting}
          onDelete={() => handleDeleteTrack(track._id)}
          isPublication={isPublication}
          onPublish={() => handlePublishTrack(track._id)}
        />
      ));
    }
  }

  const addTrackToHistory = (trackId: string) => {
    dispatch(addToHistory({ track: trackId }));
  };

  useEffect(() => {
    dispatch(fetchOneAlbum(id));
  }, [dispatch, id]);

  return (
    <ContentContainer container direction="column" spacing={2}>
      {isFetching && (
        <Grid2>
          <CircularProgress />
        </Grid2>
      )}
      {album && (
        <Grid2 container direction="column">
          <AlbumImageContainer>
            <Grid2 mr={3} component={OneAlbumCardMedia} image={albumImage} />
            <Grid2 container direction="column" spacing={1}>
              <Grid2 mt="auto" component={Typography} variant="body2">
                Album
              </Grid2>
              <Grid2
                component={Typography}
                variant="h2"
                sx={{
                  fontWeight: 900,
                }}
              >
                {album.albumName}
              </Grid2>
              <Grid2 container sx={{ gap: '3px', alignItems: 'center' }}>
                <Grid2>
                  {album.artist.image && (
                    <Avatar
                      alt={album.artist.name}
                      src={artistAvatarImage}
                      sx={{
                        width: 30,
                        height: 30,
                        mr: '5px',
                      }}
                    />
                  )}
                </Grid2>
                <Grid2
                  component={Link}
                  to={`/artists/${album.artist._id}`}
                  sx={{
                    fontSize: '14px',
                    fontWeight: 'medium',
                    color: 'white',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {album.artist.name}
                </Grid2>
                <Grid2 component={Typography}>{bull}</Grid2>
                <Grid2
                  component={Typography}
                  color="text.secondary"
                  variant="body2"
                >
                  {album.releaseYear}
                </Grid2>
                <Grid2 component={Typography}>{bull}</Grid2>
                <Grid2
                  component={Typography}
                  color="text.secondary"
                  variant="body2"
                >
                  {album.tracksNumber} songs
                </Grid2>
              </Grid2>
            </Grid2>
          </AlbumImageContainer>
          <Grid2 container spacing={2} direction="column" sx={{ pl: 3, pr: 3 }}>
            <AlbumTracksInfoContainer>
              <Typography sx={{ width: '35px' }}>#</Typography>
              <Typography>Title</Typography>
              <IconButton sx={{ ml: 'auto', width: 2, mr: 2 }} disabled>
                <AccessTimeOutlinedIcon />
              </IconButton>
            </AlbumTracksInfoContainer>
            <Grid2>{content}</Grid2>
          </Grid2>
        </Grid2>
      )}
    </ContentContainer>
  );
};

export default OneAlbum;

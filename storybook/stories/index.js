import React from 'react';
import { storiesOf } from '@storybook/react-native';
import LoadingStories from '../../screens/LoadingStory'


storiesOf('LoadingStories', module).add('default view', () => (
  <LoadingStories />
));
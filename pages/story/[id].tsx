import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import ControlService from "../../services/ControlService";

const StoryComponent = dynamic(() => import("../../components/Story"), {
  ssr: false
});

const LoadingStory = dynamic(() => import("../../screens/LoadingStory"), {
  ssr: false
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 500,
    paddingTop: 50,
    alignSelf: "center"
  }
});

const StoryPage: React.SFC<any> = ({ mainStore }) => {
  // Load the correct story
  const router = useRouter();
  const { id: storyId } = router.query;
  useEffect(() => {
    ControlService.setStory(storyId as string);
  }, []);

  return mainStore.loadingStory ? (
    <LoadingStory />
  ) : (
    <View style={styles.container}>
      <StoryComponent
        items={mainStore.story ? mainStore.story.reverse() : []}
      />
    </View>
  );
};

StoryPage.propTypes = {
  mainStore: PropTypes.any
};

export default inject("mainStore")(observer(StoryPage));

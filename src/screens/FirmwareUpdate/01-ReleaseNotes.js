/* @flow */
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { Trans } from "react-i18next";

import manager from "@ledgerhq/live-common/lib/manager";
import type { FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import { TrackScreen } from "../../analytics";
import { ScreenName } from "../../const";
import Button from "../../components/Button";
import SafeMarkdown from "../../components/SafeMarkdown";
import LText from "../../components/LText";
import NavigationScrollView from "../../components/NavigationScrollView";
import colors from "../../colors";

const forceInset = { bottom: "always" };

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  deviceId: string,
  firmware: FirmwareUpdateContext,
};

export default function FirmwareUpdateReleaseNotes({
  navigation,
  route,
}: Props) {
  const onNext = useCallback(() => {
    navigation.navigate(ScreenName.FirmwareUpdateCheckId, route.params);
  }, [navigation, route.params]);

  const firmware = route.params.firmware;
  if (!firmware) return null;
  const { osu } = firmware;
  const version = manager.getFirmwareVersion(osu);
  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <TrackScreen category="FirmwareUpdate" name="ReleaseNotes" />
      <NavigationScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
      >
        <LText style={styles.intro}>
          <Trans
            i18nKey="FirmwareUpdateReleaseNotes.introTitle"
            values={{ version }}
          >
            {"You are about to install "}
            <LText semiBold>firmware version {version}.</LText>
          </Trans>
          {"\n\n"}
          <Trans i18nKey="FirmwareUpdateReleaseNotes.introDescription1" />{" "}
          <LText semiBold>
            <Trans i18nKey="FirmwareUpdateReleaseNotes.introDescription2" />
          </LText>
        </LText>
        {osu.notes ? (
          <View style={styles.markdownSection}>
            <SafeMarkdown markdown={osu.notes} />
          </View>
        ) : null}
      </NavigationScrollView>
      <View style={styles.footer}>
        <Button
          event="FirmwareUpdateReleaseNotesContinue"
          type="primary"
          onPress={onNext}
          title={<Trans i18nKey="FirmwareUpdateReleaseNotes.action" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  body: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  intro: {
    fontSize: 14,
    color: colors.darkBlue,
  },
  markdownSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: colors.lightFog,
  },
  footer: {
    backgroundColor: colors.white,
    padding: 16,
  },
});
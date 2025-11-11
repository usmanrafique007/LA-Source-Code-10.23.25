import React, { useCallback, useEffect, useState } from 'react';
import { Linking, ScrollView, TouchableWithoutFeedback } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import BackButton from '../../components/Globals/BackButton';

import styled from 'styled-components/native';
import { ScreenContainer, ScreenHead } from '../../styles/commonStyledComponents';
import { scaleWidth } from '../../styles/scales';
import { getAsyncStorageData } from '../../constants/utils';
import StorageProperty from '../../constants/storage-property';
import AxiosRequestHandler, { connectionPath, method } from '../../network/AxiosRequestHandler';


const Link = ({ href, children }) => {
    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL(href);
        if (supported) {
            await Linking.openURL(href);
        } else {
            throw new Error(`Don't know how to open this href: ${href}`);
        }
    }, [href]);

    return <TouchableWithoutFeedback onPress={handlePress}>{children}</TouchableWithoutFeedback>;
};

const Notice = ({ navigation }) => {
    const [hasAnsweredSurvey, setHasAnsweredSurvey] = useState(false);

    useEffect(() => {
        async function checkIfUserHasAnsweredSurvey() {
            try {
                const data = {
                    device_id: await DeviceInfo.getUniqueId()
                }
                const requestConfig = {
                    data: data,
                    method: method.post,
                    url: connectionPath.users.validateUserSurvey,
                }

                const response = await AxiosRequestHandler(requestConfig, true, true)

                setHasAnsweredSurvey(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        checkIfUserHasAnsweredSurvey();
    }, []);


    return (
        <Container>
            <ScreenHead single>
                <BackButton onPress={() => navigation.goBack()} />
            </ScreenHead>
            <ScrollContainer>
            <Content>
                <Title>Notice</Title>
                <Description>
                    We regret to inform you that, due to unforeseen circumstances, we have temporarily disabled the connected bulb feature. Rest assured, the feature will return once a permanent solution is finalized.
                </Description>

                <Description>
                    You may continue to use the screen and LED light options, which we continue to improve based on user feedback.
                </Description>

                <Description>
                    If you have purchased a bulb from us, we understand this is an inconvenience. You can contact us for instructions on alternative methods to use your bulb during this period. If you choose, you may also request a credit for your purchase. Please contact us at
                    <Link href={'feedback@lightawake.biz.'}>
                        <StyledDescription>{` feedback@lightawake.biz.`}</StyledDescription>
                    </Link>
                </Description>

                <Description>
                    We appreciate your understanding. Thank you for your continued support of Light Awake!
                </Description>

                <Description style={{ alignSelf: 'flex-start' }}>
                    <Bold>
                        {`Best regards,\n`}
                    </Bold>
                    <Bold>
                        Light Awake Team
                    </Bold>
                </Description>

            </Content>
            </ScrollContainer>
       
        </Container>
    );
};

const Container = styled(ScreenContainer)`
  background-color: ${(props) => props.theme.colors.darkIndigoThree};
  padding: 0;
  align-items: flex-start;
`;

const Content = styled.View`
  display: flex;
  width: 85%;
  height: 85%;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: ${Math.max(scaleWidth(40), 40)}px;
  color: ${(props) => props.theme.colors.white};
  padding-bottom: 5%;
`;

const Description = styled.Text`
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: ${Math.max(scaleWidth(14), 14)}px;
  line-height: ${scaleWidth(24)}px;
  color: ${(props) => props.theme.colors.white};
  padding: 4% 0;
`;

const StyledDescription = styled(Description)`
  color: ${(props) => props.theme.colors.yellow};
`;

const Bold = styled(Description)`
  font-weight: 700;
`;

const Inline = styled.View`
  flex-direction: row;
`;

const ScrollContainer = styled.ScrollView`
margin-top:10%;
width:100%
`;

export default Notice;

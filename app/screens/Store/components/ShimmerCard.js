import { View, StyleSheet } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';

const ShimmerCard = () => {
    return (
        <View style={styles.card}>
            <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.musicIcon}
            />
            <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.title}
            />
            <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.subtitle}
            />
            <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.price}
            />
            <View style={styles.tickPlaceholder} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        height: responsiveScreenHeight(Platform.OS === 'ios' ? 56 : 55),
        backgroundColor: '#1d0f57',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginRight: 30,
        justifyContent: 'space-between',
    },
    musicIcon: {
        width: 200,
        height: 200,
        borderRadius: 120,
        alignSelf: 'center',
    },
    title: {
        height: 20,
        width: 100,
        borderRadius: 4,
        marginBottom: -60,
    },
    subtitle: {
        height: 14,
        width: 140,
        borderRadius: 4,
    },
    price: {
        height: 20,
        width: 60,
        borderRadius: 4,
        bottom: 40,
    },
    tickPlaceholder: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#f3d449',
        position: 'absolute',
        bottom: 50,
        right: 20,
        opacity: 0.3,
    },
});

export default ShimmerCard;

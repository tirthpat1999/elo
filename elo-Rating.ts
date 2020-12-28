function expectedScore(ratingDiff , exponentDenominator : number){
    const exponent = ratingDiff / exponentDenominator
    return (1/Math.pow(10,exponent))
}

type expectedFighterScores = (fighter1Rating,fighter2Rating) => [fighter1Probability: number,ratingDiffFighter1:number, Fighter2Probability:number, ratingDiffFighter2:number]

function createExpectatedScore(exponentDenominator: number){

    const expectedScores: expectedFighterScores = (fighter1Rating, fighter2Rating) => {
        const ratingDiffFighter1 = fighter2Rating - fighter1Rating
        const ratingDiffFighter2 = fighter1Rating - fighter2Rating

        const fighter1Probability = expectedScore(ratingDiffFighter1, exponentDenominator)
        const Fighter2Probability = expectedScore(ratingDiffFighter2, exponentDenominator)

        return [
            fighter1Probability,
            ratingDiffFighter1,
            Fighter2Probability,
            ratingDiffFighter2
        ]
    } 
    return expectedScores;
}

type ratingUpdate = (rating: number, actualPoints: number, expectedPoints: number) => [nextRating: number, ratingChange: number]

function updateRating(k: number): ratingUpdate {
    return( rating: number, expectedScore: number, actualScore: number) => {
    const change = Math.round(k*(actualScore - expectedScore));
    const updatedRating = rating + change;

    return [updatedRating, change];  
    }
}

function updateBothRatings(getExpectedScores: expectedFighterScores, fighter1Update: ratingUpdate,fighter2Update: ratingUpdate ) {
    const updates = (fighter1Rating: number,fighter2Rating: number, score1:number ) =>{
        const [expectedFighter1Score, expectedFighter2Score] = getExpectedScores(fighter1Rating, fighter2Rating)
        const [newFighter1Rating, fighter1RatingDiff] = fighter1Update(fighter1Rating, score1, expectedFighter1Score)
        const [newFighter2Rating, fighter2RatingDiff] = fighter2Update(fighter2Rating, (1-score1), expectedFighter2Score)

    return {newFighter1Rating,fighter1RatingDiff, newFighter2Rating, fighter2RatingDiff}
    }
    return updates
}

export type RatingSystem = {getPlayerProbabilities: expectedFighterScores, getNextRating: ratingUpdate, getNextRatings: ratingUpdate;
}

export function createSystem(kFactor = 32, exponentDenominator = 400 ){
    const getExpected = createExpectatedScore(exponentDenominator)
    const getRating = updateRating(kFactor)
    const updatedRatings = updateBothRatings(getExpected,getRating,getRating)

    return {
        getExpected, getRating, updatedRatings
    }
}

export default createSystem
# -----------------------------------------+
# Turner Burchard                          |
# CSCI 127, Program 2                      |
# Last Updated 9/21/2020                   |
# -----------------------------------------|
# Simplified Poker Hand evaluation system. |
# -----------------------------------------+

def get_all_ranks(hand):
    return [hand[x][0] for x in range(5)] #returns set of ranks, no suits

def royal_flush(hand):
    return (len(set([hand[x][1] for x in range(5)])) == 1) and hand[0][0] == 10 #if the set of suits is length one, there is one suit. If the first card is 10, there must be an ace high straight

def straight_flush(hand):
    return (len(set([hand[x][1] for x in range(5)])) == 1) and(hand[4][0] - hand[0][0] == 4)  #if the set of suits is length one, there is one suit. If the gap between the first and last is 4, there is a straight

def straight(ranks):
    return ranks[4]-ranks[0] == 4 and len(set(ranks)) == 5  #if each is different ranks and there is a gap of 4, they are all in a row/straight

def four_of_a_kind(ranks):
    return ranks.count(ranks[0]) == 4 or ranks.count(ranks[1]) == 4 #either the first or second card must be part of the 4 of a kind

def full_house(ranks):
    return len(set(ranks)) == 2 # if there is not a 4 of a kind, the only way to have only 2 types of ranks is to have a full house

def three_of_a_kind(ranks):
    return ranks.count(ranks[0]) == 3 or ranks.count(ranks[1]) == 3 or ranks.count(ranks[2]) == 3 #one of the first 3 cards must be part of the 3 of a kind, and we know there isn't a full house

def two_pair(ranks):
    return len(set(ranks)) == 3 #if there isn't a 3 of a kind, the only way to have only 3 types of cards is to have two pair

def one_pair(ranks):
    return len(set(ranks)) == 4 #the only way to have 4 unique cards is a single pair


def evaluate(poker_hand):
    poker_hand.sort()
    poker_hand_ranks = get_all_ranks(poker_hand)
    print(poker_hand, "--> ", end="")
    if royal_flush(poker_hand):
        print("Royal Flush")
    elif straight_flush(poker_hand):
        print("Straight Flush")
    elif four_of_a_kind(poker_hand_ranks):
        print("Four of a Kind")
    elif full_house(poker_hand_ranks):
        print("Full House")
    elif straight(poker_hand_ranks):
        print("Straight")
    elif three_of_a_kind(poker_hand_ranks):
        print("Three of a Kind")
    elif two_pair(poker_hand_ranks):
        print("Two Pair")
    elif one_pair(poker_hand_ranks):
        print("One Pair")
    else:
        print("Nothing")
		
# -----------------------------------------+

def main():
    print("CSCI 127: Poker Hand Evaluation Program")
    print("---------------------------------------")
    evaluate([[10, "spades"], [14, "spades"], [12, "spades"], [13, "spades"], [11, "spades"]])  # royal flush
    evaluate([[10, "clubs"], [9, "clubs"], [6, "clubs"], [7, "clubs"], [8, "clubs"]])           # straight flush
    evaluate([[2, "diamonds"], [7, "clubs"], [2, "hearts"], [2, "clubs"], [2, "spades"]])       # 4 of a kind
    evaluate([[8, "diamonds"], [7, "clubs"], [8, "hearts"], [8, "clubs"], [7, "spades"]])       # full house
    evaluate([[13, "diamonds"], [7, "clubs"], [7, "hearts"], [8, "clubs"], [7, "spades"]])      # 3 of a kind
    evaluate([[10, "clubs"], [9, "clubs"], [6, "clubs"], [7, "clubs"], [8, "spades"]])          # straight
    evaluate([[10, "spades"], [9, "clubs"], [6, "diamonds"], [9, "diamonds"], [6, "hearts"]])   # 2 pair
    evaluate([[10, "spades"], [12, "clubs"], [6, "diamonds"], [9, "diamonds"], [12, "hearts"]]) # 1 pair
    evaluate([[2, "spades"], [7, "clubs"], [8, "diamonds"], [13, "diamonds"], [11, "hearts"]])  # nothing

##    evaluate([[14, "spades"], [10, "spades"], [8, "spades"], [2, "hearts"], [5, "spades"]])     # nothing
##    evaluate([[14, "spades"], [6, "spades"], [8, "spades"], [6, "hearts"], [5, "spades"]])      # 1 pair
##    evaluate([[14, "spades"], [6, "spades"], [14, "clubs"], [6, "hearts"], [5, "spades"]])      # 2 pair
##    evaluate([[14, "spades"], [6, "spades"], [8, "spades"], [6, "hearts"], [6, "clubs"]])       # 3 of a kind
##    evaluate([[3, "spades"], [5, "spades"], [6, "spades"], [4, "hearts"], [2, "spades"]])       # straight
##    evaluate([[4, "spades"], [6, "spades"], [4, "diamonds"], [6, "hearts"], [6, "clubs"]])      # full house
##    evaluate([[14, "spades"], [6, "spades"], [6, "diamonds"], [6, "hearts"], [6, "clubs"]])     # 4 of a kind
##    evaluate([[13, "spades"], [11, "spades"], [12, "spades"], [9, "spades"], [10, "spades"]])   # straight flush
##    evaluate([[13, "spades"], [11, "spades"], [12, "spades"], [14, "spades"], [10, "spades"]])  # royal flush

# -----------------------------------------+

main()

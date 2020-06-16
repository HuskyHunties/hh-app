import {Dimensions} from 'react-native';

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

// clue data description
export interface Clue {
  id: number;
  listID: string;
  clueNumber: number;
  name: string;
  description: string;
  lat: number;
  long: number;
}

/**
 * Holds a name and pathID of a group
 */
export interface Group {
  groupID: number;
  name: String;
  pathID: number;
}

/**
 * Holds a name and pathID of a path
 */
export interface Path {
  name: String;
  pathID: number;
}
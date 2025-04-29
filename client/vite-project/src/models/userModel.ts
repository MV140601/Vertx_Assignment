export interface User {
    _id: string,
    UserName: string, 
    Email: string,    
    Password: string,
    Role: string
    About: string,
    RewardPoints: number,     
    savedPosts: string[], 
    reportedPosts: string[]
  }
// node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// new timers, tasks, operations are recorded from myFile running
myFIle.runContents();

function shouldContinue () {
  //* Check one: Any pending SetTimeOut, SetInterval, SetImmediate ?
  //* Check two: Any pending OS tasks? (Like server listening port)
  //* Check three: Any pending long running operations? (Like fs module)
  return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// Entire body executes in one 'tick'
while (shouldContinue()) {
  // * 1) Node looks on pendingTimers and sees if any functions are ready to be called
  
  //* 2) Node looks on pendingOSTasks and pendingOperations and calls
  //* relevant callbacks

  //* 3) Pause execution. Continue when:
  //* - a new pendingOSTask is done
  //* - a new pendingOperation is done 
  //* - a timer is about to complete

  //* 4) Node look on pendingTimers. Call any SetImmediate.

  //* 5) Handle any 'close' events
}


// exit back to terminal
    
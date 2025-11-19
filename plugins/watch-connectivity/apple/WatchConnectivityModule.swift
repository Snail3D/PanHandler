import Foundation
import WatchConnectivity
import React

@objc(WatchConnectivityModule)
class WatchConnectivityModule: RCTEventEmitter, WCSessionDelegate {
  
  var session: WCSession?
  var hasListeners = false
  
  override init() {
    super.init()
    if WCSession.isSupported() {
      session = WCSession.default
      session?.delegate = self
      session?.activate()
    }
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func supportedEvents() -> [String]! {
    return ["onWatchMessage", "onRemoteShutter"]
  }
  
  override func startObserving() {
    hasListeners = true
  }
  
  override func stopObserving() {
    hasListeners = false
  }
  
  // MARK: - Exposed Methods
  
  @objc
  func checkAvailability(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let session = session else {
      resolve([
        "isPaired": false,
        "isWatchAppInstalled": false,
        "isReachable": false
      ])
      return
    }
    
    resolve([
      "isPaired": session.isPaired,
      "isWatchAppInstalled": session.isWatchAppInstalled,
      "isReachable": session.isReachable
    ])
  }
  
  @objc
  func sendMessage(_ message: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let session = session, session.isReachable else {
      reject("WATCH_NOT_REACHABLE", "Watch is not reachable", nil)
      return
    }
    
    session.sendMessage(message, replyHandler: nil) { error in
      reject("SEND_ERROR", error.localizedDescription, error)
    }
    resolve(true)
  }
  
  // MARK: - WCSessionDelegate
  
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    // Handle activation
  }
  
  func sessionDidBecomeInactive(_ session: WCSession) {
    // Handle inactivity
  }
  
  func sessionDidDeactivate(_ session: WCSession) {
    session.activate()
  }
  
  func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
    if hasListeners {
      if let action = message["action"] as? String, action == "remoteShutter" {
        sendEvent(withName: "onRemoteShutter", body: nil)
      } else {
        sendEvent(withName: "onWatchMessage", body: message)
      }
    }
  }
}








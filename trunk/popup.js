// Copyright 2011, the Google Tasks Chrome Extension authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var backgroundPage = chrome.extension.getBackgroundPage();
var currentVisitingURL = '';
var currentTabId = 0;

chrome.tabs.getSelected(null, function(tab) {
  currentVisitingURL = tab.url;
  currentTabId = tab.id;
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'selectionResult':
      initPopupDone(request.selection);
      break;
  }
});

function doAddNewTask(text) {
  text = text.replace(/^\s+|\s+$/g, '');
  if (!text)
    return;
  var timeStamp = Date.now();
  var taskObject = {
    url: currentVisitingURL,
    title: text,
    content: text,
    timeStamp: timeStamp
  };
  backgroundPage.addTask(taskObject);
  chrome.tabs.update(currentTabId, { selected: true });
}

function resetTaskInput() {
  var e = document.getElementById('task_input');
  e.style.fontStyle = 'normal';
  e.style.color = 'black';
}

function initPopup() {
  chrome.tabs.sendRequest(currentTabId, {
    type: 'getSelectionText',
  }, function() { });
}

function initPopupDone(text) {
  var e = document.getElementById('task_input');
  if (text) {
    e.value = text;
    resetTaskInput();
  }
  e.focus();
}

function onEditTask() {
  resetTaskInput();
}

function submitNewTask() {
  var e = document.getElementById('task_input');
  try {
    doAddNewTask(e.value);
  } catch (exception) {
    e.value = '';
    return;
  }
  window.close();
}

function navigateNew(url) {
  chrome.tabs.create({url: url});
}

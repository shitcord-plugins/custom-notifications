import React from 'react';

export default function Margin({top = 0, right = 0, bottom = 0, left = 0, all = 0}) {
	return <div style={all ? {margin: all} : {marginTop: top, marginRight: right, marginBottom: bottom, marginLeft: left}} />;
}
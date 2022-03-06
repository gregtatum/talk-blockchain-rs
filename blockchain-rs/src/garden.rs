//! This file is the basis for garden-rs, a separate project where I'm building
//! a distributed p2p garden experience: https://github.com/gregtatum/garden-rs/
//!
//! It demonstrates how to use the blockchain with Rust structs beyond a simple string.

use crate::SerializedBytes;
use bincode;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use uuid::Uuid;

/// Many types of events could be added here and stored on a block chain.
#[derive(Serialize, Deserialize, Clone, PartialEq)]
pub enum Event {
    CreatePlot(GardenPlot),
}

/// The Event must be able to be serialized in a consistent way. This is using
/// the bincode serializer. However you could do other strategies like convert it
/// to human readable JSON, and then serialize the bytes of the JSON.
impl SerializedBytes for Event {
    fn serialized_bytes(&self) -> Cow<[u8]> {
        Cow::from(bincode::serialize(self).expect("Unable to serialize Event."))
    }
}

/// Create a garden plot.
#[derive(Serialize, Deserialize, Clone, PartialEq)]
pub struct GardenPlot {
    pub uuid: Uuid,
    pub name: String,
}

impl GardenPlot {
    pub fn new(name: String) -> Self {
        Self {
            uuid: Uuid::new_v4(),
            name,
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::block_chain::BlockChain;

    #[test]
    fn test_create_garden_pot() {
        let mut block_chain = BlockChain::<Event>::new(0);
        block_chain.add_data(Event::CreatePlot(GardenPlot::new("Greg's plot".into())));
        serde_json::to_string_pretty(&block_chain.blocks)
            .expect("Unable to serialize blocks to json");
        // [
        //     {
        //       "hash": "a63b3a79d28c4df04c4988fd40200f6acb32bfaa947731a8a18c2d55e8c166e1",
        //       "computation_time": {
        //         "secs": 0,
        //         "nanos": 32240
        //       },
        //       "payload": {
        //         "parent": "0000000000000000000000000000000000000000000000000000000000000000",
        //         "timestamp": 1642369782,
        //         "data": {
        //           "CreatePlot": {
        //             "uuid": "96ab8e21-6959-4b21-a02c-5320ae7a5d70",
        //             "name": "Greg's plot"
        //           }
        //         },
        //         "proof_of_work": 0
        //       }
        //     }
        //   ]
    }
}
